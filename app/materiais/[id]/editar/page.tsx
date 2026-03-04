"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  listarMateriais,
  atualizarMaterial,
  CriarMaterialInput,
  TipoMedicao,
} from "../../../../src/services/materiaisService";
import ProtectedRoute from "../../../../src/components/ProtectedRoute";
import { useAuth } from "../../../../src/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../../../src/contexts/LanguageContext";

function EditarMaterialContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const { t } = useLanguage();

  const [formData, setFormData] = useState<CriarMaterialInput>({
    nome: "",
    tipoMedicao: "unidade",
    precoCompra: 0,
    quantidadeComprada: 0,
    fornecedor: "",
    observacoes: "",
    usuarioId: user?.uid || "",
  });

  useEffect(() => {
    carregarMaterial();
  }, [params.id, user]);

  const carregarMaterial = async () => {
    if (!user?.uid || !params.id) return;

    setCarregando(true);
    const materiais = await listarMateriais(user.uid);
    const material = materiais.find((m) => m.id === params.id);

    if (material) {
      setFormData({
        nome: material.nome,
        tipoMedicao: material.tipoMedicao,
        precoCompra: material.precoCompra,
        quantidadeComprada: material.quantidadeComprada,
        larguraComprada: material.larguraComprada,
        alturaComprada: material.alturaComprada,
        comprimentoComprado: material.comprimentoComprado,
        fornecedor: material.fornecedor || "",
        observacoes: material.observacoes || "",
        usuarioId: user.uid,
      });
    } else {
      alert(t.materialNaoEncontrado);
      router.push("/materiais");
    }

    setCarregando(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const resultado = await atualizarMaterial(params.id as string, formData);

    if (resultado.success) {
      router.push("/materiais");
    } else {
      alert(t.erroAtualizarMaterial);
    }

    setSalvando(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    let valorProcessado: any = value;

    // Converte números
    if (
      [
        "precoCompra",
        "quantidadeComprada",
        "larguraComprada",
        "alturaComprada",
        "comprimentoComprado",
      ].includes(name)
    ) {
      valorProcessado = parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: valorProcessado }));
  };

  if (carregando) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #00FFCC",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6B7280" }}>{t.carregandoMaterial}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Mobile Header */}
      <header
        className="mobile-header"
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/materiais" style={{ color: "#6B7280", display: "flex" }}>
            <ArrowLeft size={24} />
          </Link>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#111827",
              margin: 0,
            }}
          >
            {t.editarMaterialTitulo}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="content-wrapper">
        {/* Desktop Header */}
        <div className="desktop-header" style={{ marginBottom: "24px" }}>
          <Link
            href="/materiais"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#6B7280",
              textDecoration: "none",
              fontSize: "14px",
              marginBottom: "16px",
              fontWeight: "500",
            }}
          >
            <ArrowLeft size={18} />
            {t.voltarMateriais}
          </Link>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111827",
              margin: "0 0 8px 0",
            }}
          >
            {t.editarMaterialTitulo}
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
            {t.editarMaterialSubtitulo}
          </p>
        </div>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            padding: "24px",
            maxWidth: "800px",
          }}
        >
          {/* Nome */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              {t.nomeDoMaterial}
            </label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              placeholder={t.placeholderNomeMaterial}
              onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>

          {/* Tipo de Medição */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "10px",
              }}
            >
              {t.tipoMedicaoLabel}
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "12px",
              }}
            >
              <label
                style={{
                  border:
                    formData.tipoMedicao === "unidade"
                      ? "2px solid #00FFCC"
                      : "2px solid #E5E7EB",
                  backgroundColor:
                    formData.tipoMedicao === "unidade" ? "#F0FDFA" : "white",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                <input
                  type="radio"
                  name="tipoMedicao"
                  value="unidade"
                  checked={formData.tipoMedicao === "unidade"}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📦</div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 4px 0",
                  }}
                >
                  {t.porUnidade}
                </p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                  {" "}
                  {t.descricaoUnidade}
                </p>
              </label>

              <label
                style={{
                  border:
                    formData.tipoMedicao === "comprimento"
                      ? "2px solid #00FFCC"
                      : "2px solid #E5E7EB",
                  backgroundColor:
                    formData.tipoMedicao === "comprimento"
                      ? "#F0FDFA"
                      : "white",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                <input
                  type="radio"
                  name="tipoMedicao"
                  value="comprimento"
                  checked={formData.tipoMedicao === "comprimento"}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📏</div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 4px 0",
                  }}
                >
                  {t.porComprimento}
                </p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                  {" "}
                  {t.descricaoComprimento}
                </p>
              </label>

              <label
                style={{
                  border:
                    formData.tipoMedicao === "area"
                      ? "2px solid #00FFCC"
                      : "2px solid #E5E7EB",
                  backgroundColor:
                    formData.tipoMedicao === "area" ? "#F0FDFA" : "white",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                <input
                  type="radio"
                  name="tipoMedicao"
                  value="area"
                  checked={formData.tipoMedicao === "area"}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🧵</div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 4px 0",
                  }}
                >
                  {" "}
                  {t.porArea}
                </p>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
                  {" "}
                  {t.descricaoArea}
                </p>
              </label>
            </div>
          </div>

          {/* Preço de Compra */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              {t.quantoPagou}
            </label>
            <input
              type="number"
              name="precoCompra"
              required
              min="0"
              step="0.01"
              value={formData.precoCompra}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
              placeholder="0.00"
              onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>

          {/* Campos específicos por tipo de medição */}
          {formData.tipoMedicao === "unidade" && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                {t.quantasUnidades}
              </label>
              <input
                type="number"
                name="quantidadeComprada"
                required
                min="0"
                step="1"
                value={formData.quantidadeComprada}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
                placeholder={t.placeholderUnidades}
                onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
                onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
              />
            </div>
          )}

          {formData.tipoMedicao === "comprimento" && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                {t.comprimentoCm}
              </label>
              <input
                type="number"
                name="comprimentoComprado"
                required
                min="0"
                step="0.1"
                value={formData.comprimentoComprado || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
                placeholder={t.placeholderComprimento}
                onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
                onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
              />
            </div>
          )}

          {formData.tipoMedicao === "area" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  {t.largura}
                </label>
                <input
                  type="number"
                  name="larguraComprada"
                  required
                  min="0"
                  step="0.1"
                  value={formData.larguraComprada || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  placeholder="Ex: 150"
                  onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  {t.altura}
                </label>
                <input
                  type="number"
                  name="alturaComprada"
                  required
                  min="0"
                  step="0.1"
                  value={formData.alturaComprada || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  placeholder="Ex: 100"
                  onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                />
              </div>
            </div>
          )}

          {/* Fornecedor */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              {t.fornecedor}
            </label>
            <input
              type="text"
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
              placeholder={t.placeholderFornecedor}
              onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>

          {/* Observações */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "6px",
              }}
            >
              {t.observacoes}
            </label>
            <textarea
              name="observacoes"
              rows={3}
              value={formData.observacoes}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
              placeholder={t.placeholderObservacoes}
              onFocus={(e) => (e.target.style.borderColor = "#00FFCC")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>

          {/* Botões */}
          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid #D1D5DB",
                backgroundColor: "white",
                color: "#374151",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t.cancelar}
            </button>
            <button
              type="submit"
              disabled={salvando}
              style={{
                flex: 1,
                padding: "12px",
                border: "none",
                backgroundColor: salvando ? "#9CA3AF" : "#00FFCC",
                color: "#111827",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: salvando ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {salvando ? t.salvando : t.atualizarMaterial}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .mobile-header {
          display: block;
        }

        .desktop-header {
          display: none;
        }

        .page-container {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .content-wrapper {
          padding: 16px;
        }

        @media (min-width: 768px) {
          .mobile-header {
            display: none;
          }

          .desktop-header {
            display: block;
          }

          .content-wrapper {
            padding: 32px 40px;
            max-width: 1400px;
          }
        }
      `}</style>
    </div>
  );
}

export default function EditarMaterialPage() {
  return (
    <ProtectedRoute>
      <EditarMaterialContent />
    </ProtectedRoute>
  );
}
