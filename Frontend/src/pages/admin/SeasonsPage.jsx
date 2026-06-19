import { useState, useEffect } from "react";
import { Plus, Check, Pencil, Trash2, Sparkles } from "lucide-react";

import AdminLayout       from "../../layouts/AdminLayout";
import AdminHeader       from "../../features/admin/components/AdminHeader";
import SeasonFormModal   from "../../features/admin/seasons/components/SeasonFormModal";
import DeleteSeasonModal from "../../features/admin/seasons/components/DeleteSeasonModal";

import {
  createSeason, updateSeason, deleteSeason,
  activateSeason, markAsNext, unmarkAsNext,
} from "../../features/admin/seasons/services/season.service";
import { useSeasons } from "../../features/admin/seasons/hooks/useSeasons";

export default function SeasonsPage() {
  const { seasons, loading, error, refetch } = useSeasons();

  const [openModal,      setOpenModal]      = useState(false);
  const [deleteModal,    setDeleteModal]    = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [saving,         setSaving]         = useState(false);
  const [activating,     setActivating]     = useState(null);
  const [markingNext,    setMarkingNext]    = useState(null);

  useEffect(() => {
    document.title = "Temporadas — AniCalendar Admin";
  }, []);

  const handleCreate = async (data) => {
    try {
      setSaving(true);
      await createSeason(data);
      setOpenModal(false);
      refetch();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = async (data) => {
    try {
      setSaving(true);
      await updateSeason(selectedSeason.id, data);
      setOpenModal(false);
      setSelectedSeason(null);
      refetch();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteSeason(selectedSeason.id);
      setDeleteModal(false);
      setSelectedSeason(null);
      refetch();
    } catch (err) { alert(err.message); }
  };

  const handleActivate = async (season) => {
    try {
      setActivating(season.id);
      await activateSeason(season.id);
      refetch();
    } catch (err) { alert(err.message); }
    finally { setActivating(null); }
  };

  const handleMarkNext = async (season) => {
    try {
      setMarkingNext(season.id);
      if (season.isNext) {
        await unmarkAsNext(season.id);
      } else {
        await markAsNext(season.id);
      }
      refetch();
    } catch (err) { alert(err.message); }
    finally { setMarkingNext(null); }
  };

  const openCreateModal = () => { setSelectedSeason(null); setOpenModal(true); };
  const openEditModal   = (s)  => { setSelectedSeason(s);   setOpenModal(true); };
  const openDeleteModal = (s)  => { setSelectedSeason(s);   setDeleteModal(true); };

  if (loading) return (
    <AdminLayout>
      <AdminHeader title="Temporadas" />
      <div style={{ padding: "32px", color: "#71717a", fontSize: "14px" }}>Cargando temporadas...</div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout>
      <AdminHeader title="Temporadas" />
      <div style={{ padding: "32px", color: "#f87171", fontSize: "14px" }}>{error}</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <AdminHeader title="Temporadas" />

      <div style={{ padding: "32px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#52525b" }}>
            {seasons.length} temporada{seasons.length !== 1 ? "s" : ""} registradas
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2"
            style={{
              background: "#10b981", color: "#000",
              fontWeight: 800, fontSize: "14px",
              padding: "10px 20px", borderRadius: "10px",
              border: "none", cursor: "pointer",
            }}
          >
            <Plus size={16} aria-hidden="true" />
            Nueva temporada
          </button>
        </div>

        <div style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Nombre", "Slug", "Estado", "Acciones"].map((h) => (
                  <th key={h} style={{
                    padding: "14px 20px", textAlign: "left",
                    fontSize: "11px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em", color: "#52525b",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, i) => (
                <tr
                  key={season.id}
                  style={{
                    borderBottom: i < seasons.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#f0f0f0" }}>
                      {season.name}
                    </p>
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      fontSize: "12px", fontFamily: "monospace", color: "#71717a",
                      background: "rgba(255,255,255,0.05)", padding: "3px 8px",
                      borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      {season.slug}
                    </span>
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      {season.isActive && (
                        <span className="flex items-center gap-1.5" style={{
                          fontSize: "12px", fontWeight: 700, color: "#10b981",
                          background: "rgba(16,185,129,0.12)",
                          border: "1px solid rgba(16,185,129,0.2)",
                          padding: "4px 10px", borderRadius: "20px", display: "inline-flex",
                        }}>
                          <Check size={11} aria-hidden="true" />
                          Activa
                        </span>
                      )}
                      {season.isNext && (
                        <span className="flex items-center gap-1.5" style={{
                          fontSize: "12px", fontWeight: 700, color: "#a78bfa",
                          background: "rgba(139,92,246,0.12)",
                          border: "1px solid rgba(139,92,246,0.2)",
                          padding: "4px 10px", borderRadius: "20px", display: "inline-flex",
                        }}>
                          <Sparkles size={11} aria-hidden="true" />
                          Próxima
                        </span>
                      )}
                      {!season.isActive && !season.isNext && (
                        <span style={{
                          fontSize: "12px", fontWeight: 600, color: "#52525b",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          padding: "4px 10px", borderRadius: "20px", display: "inline-block",
                        }}>
                          Inactiva
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>

                      {/* activar */}
                      {!season.isActive && (
                        <button
                          onClick={() => handleActivate(season)}
                          disabled={activating === season.id}
                          className="flex items-center gap-1.5"
                          style={{
                            padding: "7px 14px", borderRadius: "8px",
                            background: "rgba(16,185,129,0.12)",
                            border: "1px solid rgba(16,185,129,0.2)",
                            color: "#10b981", fontSize: "13px", fontWeight: 600,
                            cursor: activating === season.id ? "not-allowed" : "pointer",
                            opacity: activating === season.id ? 0.6 : 1,
                          }}
                        >
                          <Check size={13} aria-hidden="true" />
                          {activating === season.id ? "Activando..." : "Activar"}
                        </button>
                      )}

                      {/* marcar como próxima */}
                      {!season.isActive && (
                        <button
                          onClick={() => handleMarkNext(season)}
                          disabled={markingNext === season.id}
                          className="flex items-center gap-1.5"
                          style={{
                            padding: "7px 14px", borderRadius: "8px",
                            background: season.isNext ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.08)",
                            border: `1px solid ${season.isNext ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.2)"}`,
                            color: "#a78bfa", fontSize: "13px", fontWeight: 600,
                            cursor: markingNext === season.id ? "not-allowed" : "pointer",
                            opacity: markingNext === season.id ? 0.6 : 1,
                          }}
                        >
                          <Sparkles size={13} aria-hidden="true" />
                          {markingNext === season.id
                            ? "Guardando..."
                            : season.isNext ? "Quitar próxima" : "Marcar próxima"
                          }
                        </button>
                      )}

                      {/* editar */}
                      <button
                        onClick={() => openEditModal(season)}
                        className="flex items-center gap-1.5"
                        style={{
                          padding: "7px 14px", borderRadius: "8px",
                          background: "rgba(59,130,246,0.12)",
                          border: "1px solid rgba(59,130,246,0.2)",
                          color: "#60a5fa", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        <Pencil size={13} aria-hidden="true" /> Editar
                      </button>

                      {/* eliminar */}
                      <button
                        onClick={() => openDeleteModal(season)}
                        disabled={season.isActive}
                        className="flex items-center gap-1.5"
                        style={{
                          padding: "7px 14px", borderRadius: "8px",
                          background: season.isActive ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.1)",
                          border: `1px solid ${season.isActive ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.2)"}`,
                          color: season.isActive ? "#3f3f46" : "#f87171",
                          fontSize: "13px", fontWeight: 600,
                          cursor: season.isActive ? "not-allowed" : "pointer",
                        }}
                        title={season.isActive ? "No puedes eliminar la temporada activa" : ""}
                      >
                        <Trash2 size={13} aria-hidden="true" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SeasonFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={selectedSeason ? handleEdit : handleCreate}
        season={selectedSeason}
        saving={saving}
      />

      <DeleteSeasonModal
        open={deleteModal}
        season={selectedSeason}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}