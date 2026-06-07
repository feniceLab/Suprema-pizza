// Drag-drop + preview + upload para /api/creative/upload.
import { useRef, useState } from 'react';
import type { CriativoUpload } from './types';

export interface CreativeUploadProps {
  apiBase: string;
  slug: string;
  value: CriativoUpload | undefined;
  onChange: (v: CriativoUpload | undefined) => void;
}

const ACCEPT = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime';
const MAX_MB = 30;

export function CreativeUpload({ apiBase, slug, value, onChange }: CreativeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  /** Fase pós-upload: servidor mandando pro Meta (sem progresso mensurável). */
  const [processando, setProcessando] = useState(false);

  const upload = async (file: File) => {
    setError(null);
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Arquivo grande demais (máx ${MAX_MB}MB).`);
      return;
    }

    setUploading(true);
    setProcessando(false);
    setProgress(0);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slug', slug);
      form.append('tipo', file.type.startsWith('video') ? 'video' : 'image');

      const previewUrl = URL.createObjectURL(file);

      // Upload via XHR pra ter progress
      const result = await new Promise<{ ok?: boolean; image_hash?: string; video_id?: string; error?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 90_000; // 90s — vídeo grande no Meta pode demorar
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
            // Bytes 100% enviados → entra fase "processando no Meta"
            if (pct >= 100) setProcessando(true);
          }
        };
        xhr.upload.onload = () => setProcessando(true);
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              if (json.ok === false) reject(new Error(json.error || 'Upload rejeitado pelo servidor'));
              else resolve(json);
            } catch { reject(new Error('Resposta inválida do servidor')); }
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText || xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Falha de rede ao enviar'));
        xhr.ontimeout = () => reject(new Error('Tempo esgotado (90s). Tente um arquivo menor ou comprima o vídeo.'));
        xhr.open('POST', `${apiBase}/api/creative/upload`);
        xhr.send(form);
      });

      onChange({
        tipo: file.type.startsWith('video') ? 'video' : 'image',
        image_hash: result.image_hash,
        video_id: result.video_id,
        preview_url: previewUrl,
        filename: file.name,
      });
    } catch (err) {
      setError((err as Error).message || 'Falha no upload');
    } finally {
      setUploading(false);
      setProcessando(false);
      setProgress(0);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div className="criar-creative">
      {value ? (
        <div className="criar-creative-preview">
          {value.tipo === 'video' ? (
            <video src={value.preview_url} controls className="criar-creative-media" />
          ) : (
            <img src={value.preview_url} alt={value.filename || 'criativo'} className="criar-creative-media" />
          )}
          <div className="criar-creative-info">
            <div className="criar-creative-filename">{value.filename || 'arquivo'}</div>
            <button
              type="button"
              className="criar-creative-remove"
              onClick={() => onChange(undefined)}
              aria-label="Remover criativo"
            >
              Trocar
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`criar-creative-drop${dragging ? ' is-dragging' : ''}${uploading ? ' is-uploading' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Selecionar imagem ou vídeo"
        >
          {uploading ? (
            <>
              <div className="criar-creative-icon" aria-hidden>{processando ? '⟳' : '↑'}</div>
              <div className="criar-creative-cta">
                {processando ? 'Processando no Meta…' : `Enviando… ${progress}%`}
              </div>
              <div className="criar-creative-progress">
                <div
                  className={`criar-creative-progress-fill${processando ? ' is-indeterminate' : ''}`}
                  style={processando ? undefined : { width: `${progress}%` }}
                />
              </div>
              {processando && (
                <div className="criar-creative-sub">Pode levar até 1 min pra vídeos.</div>
              )}
            </>
          ) : (
            <>
              <div className="criar-creative-icon" aria-hidden>📷</div>
              <div className="criar-creative-cta">Arraste foto ou vídeo aqui</div>
              <div className="criar-creative-sub">ou clique pra selecionar (até {MAX_MB}MB)</div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="criar-creative-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
        </div>
      )}
      {error && <div className="criar-creative-error" role="alert">{error}</div>}
    </div>
  );
}
