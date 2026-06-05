import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

import AdminLayout      from "../../layouts/AdminLayout";
import AdminHeader      from "../../features/admin/components/AdminHeader";
import AnimeTable       from "../../features/admin/anime-management/components/AnimeTable";
import AnimeFormModal   from "../../features/admin/anime-management/components/AnimeFormModal";
import DeleteAnimeModal from "../../features/admin/anime-management/components/DeleteAnimeModal";

import { createAnime, updateAnime, deleteAnime } from "../../features/admin/anime-management/services/anime.service";
import { createCalendarEntry, updateCalendarEntry } from "../../features/admin/anime-management/services/calendar-entry.service";
import { useAnimes } from "../../features/admin/anime-management/hooks/useAnimes";

export default function AnimeManagementPage() {
  const { animes, loading, error, refetch } = useAnimes();

  const [openModal,      setOpenModal]      = useState(false);
  const [deleteModal,    setDeleteModal]    = useState(false);
  const [deleteBulkModal, setDeleteBulkModal] = useState(false);
  const [selectedAnime,  setSelectedAnime]  = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [search,         setSearch]         = useState("");
  const [selectedIds,    setSelectedIds]    = useState(new Set());

  useEffect(() => {
    document.title = "Gestión de Animes — AniCalendar";
  }, []);

  const filteredAnimes = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return animes;
    return animes.filter((anime) =>
      anime.title?.toLowerCase().includes(q)     ||
      anime.status?.toLowerCase().includes(q)    ||
      anime.dayOfWeek?.toLowerCase().includes(q)
    );
  }, [animes, search]);

  // selección múltiple
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAnimes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAnimes.map((a) => a.id)));
    }
  };

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

  const openCreateModal = () => { setSelectedAnime(null); setOpenModal(true); };
  const openEditModal   = (anime) => { setSelectedAnime(anime); setOpenModal(true); };
  const openDeleteModal = (anime) => { setSelectedAnime(anime); setDeleteModal(true); };

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

        {/* toolbar */}
        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: "24px" }}>

          {/* búsqueda */}
          <div
            className="flex items-center gap-2"
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", padding: "0 14px",
              flex: "1", maxWidth: "420px",
            }}
          >
            <Search size={15} style={{ color: "#52525b", flexShrink: 0 }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por título, plataforma o día..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none",
                fontSize: "14px", color: "#f0f0f0", padding: "11px 0",
                width: "100%", fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", fontSize: "18px", lineHeight: 1, padding: 0, flexShrink: 0 }}
                aria-label="Limpiar búsqueda"
              >×</button>
            )}
          </div>

          {/* contador */}
          <p style={{ fontSize: "13px", color: "#52525b", whiteSpace: "nowrap" }}>
            {filteredAnimes.length} de {animes.length} anime{animes.length !== 1 ? "s" : ""}
          </p>

          <div style={{ flex: 1 }} />

          {/* eliminar seleccionados */}
          {selectedIds.size > 0 && (
            <button
              onClick={() => setDeleteBulkModal(true)}
              className="flex items-center gap-2"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontWeight: 700, fontSize: "14px",
                padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Trash2 size={15} aria-hidden="true" />
              Eliminar {selectedIds.size} seleccionado{selectedIds.size !== 1 ? "s" : ""}
            </button>
          )}

          {/* nuevo */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2"
            style={{
              background: "#10b981", color: "#000",
              fontWeight: 800, fontSize: "14px",
              padding: "10px 20px", borderRadius: "10px",
              border: "none", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            <Plus size={16} aria-hidden="true" />
            Nuevo anime
          </button>
        </div>

        {/* tabla */}
        {filteredAnimes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              background: "#111111", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "64px 32px", color: "#52525b",
            }}
          >
            <Search size={32} style={{ marginBottom: "12px", opacity: 0.4 }} aria-hidden="true" />
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#71717a", marginBottom: "4px" }}>Sin resultados</p>
            <p style={{ fontSize: "13px" }}>No se encontró ningún anime con "{search}"</p>
          </div>
        ) : (
          <AnimeTable
            animes={filteredAnimes}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
          />
        )}
      </div>

      <AnimeFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={selectedAnime ? handleEdit : handleCreate}
        anime={selectedAnime}
        saving={saving}
      />

      <DeleteAnimeModal
        open={deleteModal}
        anime={selectedAnime}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* modal borrado en lote */}
      <DeleteAnimeModal
        open={deleteBulkModal}
        anime={{ title: `${selectedIds.size} anime${selectedIds.size !== 1 ? "s" : ""}` }}
        onClose={() => setDeleteBulkModal(false)}
        onConfirm={handleDeleteBulk}
      />
    </AdminLayout>
  );
}