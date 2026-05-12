import { Trash2, X } from "lucide-react";
import Modal from "../../../../components/ui/modal/Modal";

export default function DeleteSeasonModal({ open, season, onClose, onConfirm }) {
  return (
    <Modal isOpen={open} onClose={onClose} maxWidth="max-w-sm">
      <div style={{ padding: "28px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
          <div
            style={{
              width: "42px", height: "42px", borderRadius: "10px",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#f87171",
            }}
          >
            <Trash2 size={18} aria-hidden="true" />
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#71717a", cursor: "pointer",
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <h2 className="font-black" style={{ fontSize: "18px", color: "#f0f0f0", marginBottom: "8px" }}>
          Eliminar temporada
        </h2>
        <p style={{ fontSize: "14px", color: "#71717a", lineHeight: "1.6", marginBottom: "24px" }}>
          ¿Estás seguro que deseas eliminar{" "}
          <span style={{ color: "#f0f0f0", fontWeight: 700 }}>{season?.name}</span>?
          Esta acción eliminará todas las entradas del calendario asociadas.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#a1a1aa", fontSize: "14px", fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "11px", borderRadius: "10px",
              background: "#ef4444", border: "none",
              color: "#fff", fontSize: "14px", fontWeight: 800, cursor: "pointer",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}