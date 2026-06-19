import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";

import AdminLayout      from "../../layouts/AdminLayout";
import AdminHeader      from "../../features/admin/components/AdminHeader";
import AnimeTable       from "../../features/admin/anime-management/components/AnimeTable";
import AnimeFormModal   from "../../features/admin/anime-management/components/AnimeFormModal";
import DeleteAnimeModal from "../../features/admin/anime-management/components/DeleteAnimeModal";

import { createAnime, updateAnime, deleteAnime } from "../../features/admin/anime-management/services/anime.service";
import { createCalendarEntry, updateCalendarEntry } from "../../features/admin/anime-management/services/calendar-entry.service";
import { useAnimes } from "../../features/admin/anime-management/hooks/useAnimes";

const ITEMS_PER_PAGE = 20;

export default function AnimeManagementPage() {
  const { animes, loading, error, refetch } = useAnimes();

  const [openModal,      setOpenModal]      = useState(false);
  const [deleteModal,    setDeleteModal]    = useState(false);
  const [deleteBulkModal, setDeleteBulkModal] = useState(false);
  const [selectedAnime,  setSelectedAnime]  = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [search,         setSearch]         = useState("");
  const [selectedIds,    setSelectedIds]    = useState(new Set());
  const [currentPage,    setCurrentPage]    = useState(1);
  
  // Filtros
  const [filterStatus,    setFilterStatus]   = useState("");
  const [filterDay,       setFilterDay]      = useState("");
  const [filterSeason,    setFilterSeason]   = useState("");

  useEffect(() => {
    document.title = "Gestión de Animes — AniCalendar";
  }, []);

  const DAYS_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

  // Obtener opciones únicas para los filtros
  const uniqueStatuses = useMemo(() => 
    [...new Set(animes.map(a => a.status))].filter(Boolean),
    [animes]
  );

  const uniqueDays = useMemo(() => {
    const daysSet = new Set(animes.map(a => a.dayOfWeek).filter(Boolean));
    // Retornar en el orden específico
    return DAYS_ORDER.filter(day => daysSet.has(day));
  }, [animes]);

  const uniqueSeasons = useMemo(() => {
    const seasons = [];
    const seen = new Set();
    animes.forEach(a => {
      if (a.seasonId && !seen.has(a.seasonId)) {
        seasons.push({
          id: a.seasonId,
          name: a.seasonName
        });
        seen.add(a.seasonId);
      }
    });
    return seasons;
  }, [animes]);

  // Lógica de filtrado completa
  const filteredAnimes = useMemo(() => {
    let result = animes;

    // Filtro por búsqueda
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter((anime) =>
        anime.title?.toLowerCase().includes(q)
      );
    }

    // Filtro por plataforma
    if (filterStatus) {
      result = result.filter((anime) => anime.status === filterStatus);
    }

    // Filtro por día
    if (filterDay) {
      result = result.filter((anime) => anime.dayOfWeek === filterDay);
    }

    // Filtro por temporada
    if (filterSeason) {
      result = result.filter((anime) => String(anime.seasonId) === filterSeason);
    }

    return result;
  }, [animes, search, filterStatus, filterDay, filterSeason]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterDay, filterSeason]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredAnimes.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAnimes = filteredAnimes.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Selección múltiple
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedAnimes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAnimes.map((a) => a.id)));
    }
  };

  // Handlers
  const handleCreate = async (data) => {
    try {
      setSaving(true);
      const { title, imageUrl, description, status } = data;
      const newAnime = await createAnime({ title, imageUrl, description, status });
      if (data.dayOfWeek && data.time && data.seasonId) {
        await createCalendarEntry({
          animeId:   newAnime.id,
          seasonId:  Number(data.seasonId),
          dayOfWeek: data.dayOfWeek,
          time:      data.time,
        });
      }
      setOpenModal(false);
      setCurrentPage(1);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data) => {
    try {
      setSaving(true);
      const { title, imageUrl, description, status } = data;
      await updateAnime(selectedAnime.id, { title, imageUrl, description, status });
      if (data.dayOfWeek && data.time && data.seasonId) {
        if (selectedAnime.calendarEntryId) {
          await updateCalendarEntry(selectedAnime.calendarEntryId, {
            dayOfWeek: data.dayOfWeek,
            time:      data.time,
            seasonId:  Number(data.seasonId),
          });
        } else {
          await createCalendarEntry({
            animeId:   selectedAnime.id,
            seasonId:  Number(data.seasonId),
            dayOfWeek: data.dayOfWeek,
            time:      data.time,
          });
        }
      }
      setOpenModal(false);
      setSelectedAnime(null);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnime(selectedAnime.id);
      setDeleteModal(false);
      setSelectedAnime(null);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteBulk = async () => {
    try {
      setSaving(true);
      await Promise.all([...selectedIds].map((id) => deleteAnime(id)));
      setSelectedIds(new Set());
      setDeleteBulkModal(false);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterDay("");
    setFilterSeason("");
    setSearch("");
  };

  const openCreateModal = () => { setSelectedAnime(null); setOpenModal(true); };
  const openEditModal   = (anime) => { setSelectedAnime(anime); setOpenModal(true); };
  const openDeleteModal = (anime) => { setSelectedAnime(anime); setDeleteModal(true); };

  const hasActiveFilters = search || filterStatus || filterDay || filterSeason;

  if (loading) return (
    <AdminLayout>
      <AdminHeader title="Gestión de Animes" />
      <div style={{ padding: "32px", color: "#71717a", fontSize: "14px" }}>Cargando animes...</div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <AdminHeader title="Gestión de Animes" />
      <div style={{ padding: "32px", color: "#f87171", fontSize: "14px" }}>{error}</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <AdminHeader title="Gestión de Animes" />

      <div style={{ padding: "32px" }}>

                {/* Toolbar con filtros integrados */}
        <div 
          className="flex items-center gap-3 flex-wrap"
          style={{
            marginBottom: "24px",
            gap: "12px",
          }}
        >

          {/* Búsqueda */}
          <div
            className="flex items-center gap-2 flex-1"
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", 
              padding: "0 14px",
              minWidth: "250px",
            }}
          >
            <Search size={15} style={{ color: "#52525b", flexShrink: 0 }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar anime..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent", 
                border: "none", 
                outline: "none",
                fontSize: "14px", 
                color: "#f0f0f0", 
                padding: "11px 0",
                width: "100%", 
                fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: "#52525b", 
                  fontSize: "18px", 
                  lineHeight: 1, 
                  padding: 0, 
                  flexShrink: 0 
                }}
                aria-label="Limpiar búsqueda"
              >×</button>
            )}
          </div>

          {/* Filtro Plataforma */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "#f0f0f0",
              fontSize: "12px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Plataforma</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {/* Filtro Día */}
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "#f0f0f0",
              fontSize: "12px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Todos los días</option>
            {uniqueDays.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>

          {/* Filtro Temporada */}
          <select
            value={filterSeason}
            onChange={(e) => setFilterSeason(e.target.value)}
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "#f0f0f0",
              fontSize: "12px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Todas las Temporadas</option>
            {animes
              .filter((a, i, arr) => arr.findIndex(x => x.seasonId === a.seasonId) === i)
              .map((anime) => (
                <option key={anime.seasonId} value={anime.seasonId} style={{ color: "#fff", background: "#111111" }}>
                  {anime.seasonName}
                </option>
              ))
            }
          </select>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#f87171",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <X size={14} aria-hidden="true" />
              Limpiar
            </button>
          )}

          {/* Contador */}
          <p style={{ fontSize: "13px", color: "#52525b", whiteSpace: "nowrap" }}>
            {filteredAnimes.length} de {animes.length}
          </p>

          {/* Eliminar seleccionados */}
          {selectedIds.size > 0 && (
            <button
              onClick={() => setDeleteBulkModal(true)}
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px", 
                padding: "8px 12px",
                color: "#f87171", 
                fontSize: "12px", 
                fontWeight: 600,
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: "6px",
                whiteSpace: "nowrap",
              }}
            >
              <Trash2 size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Eliminar {selectedIds.size}</span>
              <span className="sm:hidden">{selectedIds.size}</span>
            </button>
          )}

          {/* Crear nuevo */}
          <button
            onClick={openCreateModal}
            style={{
              background: "#10b981",
              border: "none",
              borderRadius: "8px", 
              padding: "10px 20px",
              color: "#000", 
              fontSize: "12px", 
              fontWeight: 600,
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Nuevo anime</span>
            <span className="sm:hidden">Nuevo anime</span>
          </button>
        </div>

        {/* Tabla */}
        {paginatedAnimes.length > 0 ? (
          <AnimeTable
            animes={paginatedAnimes}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
          />
        ) : (
          <div
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", 
              padding: "40px",
              textAlign: "center", 
              color: "#71717a", 
              fontSize: "14px",
            }}
          >
            {hasActiveFilters ? "No se encontraron animes con esos filtros." : "No hay animes aún."}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div
            style={{
              marginTop: "24px",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "12px",
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? "rgba(255,255,255,0.05)" : "#111111",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", 
                padding: "8px 12px",
                color: currentPage === 1 ? "#52525b" : "#f0f0f0",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                fontSize: "13px", 
                fontWeight: 600,
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={14} aria-hidden="true" />
              Anterior
            </button>

            <span style={{ color: "#71717a", fontSize: "13px", whiteSpace: "nowrap" }}>
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? "rgba(255,255,255,0.05)" : "#111111",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", 
                padding: "8px 12px",
                color: currentPage === totalPages ? "#52525b" : "#f0f0f0",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex", 
                alignItems: "center", 
                gap: "4px",
                fontSize: "13px", 
                fontWeight: 600,
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Siguiente
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Modales */}
        <AnimeFormModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={selectedAnime ? handleEdit : handleCreate}
          anime={selectedAnime}
          saving={saving}
        />
        <DeleteAnimeModal
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDelete}
          title={selectedAnime?.title}
        />
        <DeleteAnimeModal
          open={deleteBulkModal}
          onClose={() => setDeleteBulkModal(false)}
          onConfirm={handleDeleteBulk}
          title={`${selectedIds.size} anime(s)`}
          isBulk={true}
        />
      </div>
    </AdminLayout>
  );
}