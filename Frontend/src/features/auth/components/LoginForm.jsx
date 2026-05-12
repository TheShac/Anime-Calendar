import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginRequest } from "../services/auth.service";
import { useAuthStore } from "../../../store/authStore";

export default function LoginForm() {
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await loginRequest(form);
      login(data);
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" style={{ maxWidth: "420px" }}>

      {/* logo */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="flex items-center justify-center rounded-2xl font-mono font-black mb-5"
          style={{
            width: "60px", height: "60px",
            fontSize: "26px",
            border: "2px solid #10b981",
            color: "#10b981",
          }}
        >
          ア
        </div>
        <h1
          className="font-black tracking-tight"
          style={{ fontSize: "28px", color: "#f0f0f0" }}
        >
          Panel de administración
        </h1>
        <p style={{ fontSize: "14px", color: "#71717a", marginTop: "6px" }}>
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* username */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#52525b",
              marginBottom: "8px",
            }}
          >
            Usuario
          </label>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            value={form.username}
            onChange={handleChange("username")}
            required
            style={{
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "13px 16px",
              fontSize: "15px",
              color: "#f0f0f0",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#10b981"}
            onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>

        {/* password */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#52525b",
              marginBottom: "8px",
            }}
          >
            Contraseña
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange("password")}
              required
              style={{
                width: "100%",
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "13px 48px 13px 16px",
                fontSize: "15px",
                color: "#f0f0f0",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#10b981"}
              onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#52525b",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {/* submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2"
          style={{
            width: "100%",
            background: loading ? "#059669" : "#10b981",
            color: "#000000",
            fontWeight: 800,
            fontSize: "15px",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.8 : 1,
            transition: "all 0.15s",
            marginTop: "4px",
          }}
        >
          {loading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Ingresando...
            </>
          ) : (
            <>
              <LogIn size={16} aria-hidden="true" />
              Ingresar
            </>
          )}
        </button>
      </div>
    </form>
  );
}