import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { FOLDERS, folderForMime, formatBytes } from "../fileTypes";

const MAX_SIZE = 25 * 1024 * 1024;
const ACCEPTED =
  "image/*,video/*,application/pdf,text/plain,.txt";

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const folder = file ? folderForMime(file.type) : null;

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    validateAndSet(picked);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    validateAndSet(dropped);
  };

  const validateAndSet = (f) => {
    setError("");
    if (!folderForMime(f.type)) {
      setError("Unsupported file type. Use images, videos, PDF, or text.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError(`File is too large. Max ${formatBytes(MAX_SIZE)}.`);
      return;
    }
    setFile(f);
    setProgress(0);
    setStatus("idle");
  };

  const handleUpload = () => {
    if (!file || !user) return;

    setStatus("uploading");
    setError("");
    setProgress(0);

    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `users/${user.uid}/${folder}/${Date.now()}_${safeName}`;
    const fileRef = storageRef(storage, path);

    const task = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    });

    task.on(
      "state_changed",
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(Math.round(pct));
      },
      (err) => {
        console.error(err);
        setStatus("error");
        setError("Upload failed. Please try again.");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, "files"), {
            ownerId: user.uid,
            name: file.name,
            storagePath: path,
            downloadURL,
            type: file.type,
            size: file.size,
            createdAt: serverTimestamp(),
          });
          setStatus("done");
          setTimeout(() => navigate("/files"), 700);
        } catch (err) {
          console.error(err);
          setStatus("error");
          setError("Upload finished but saving info failed.");
        }
      }
    );
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Upload a file</h1>
        <p className="muted">
          Images, videos, PDFs, or text files. Max {formatBytes(MAX_SIZE)}.
        </p>
      </div>

      <div
        className={`drop-zone ${file ? "has-file" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={handlePick}
          hidden
        />

        {!file ? (
          <>
            <div className="drop-icon">📤</div>
            <p className="drop-title">Drop a file here or click to browse</p>
            <p className="drop-hint">
              Supported: {Object.values(FOLDERS).map((f) => f.label).join(", ")}
            </p>
          </>
        ) : (
          <div className="file-preview">
            <div className="file-preview-icon">
              {FOLDERS[folder]?.icon ?? "📁"}
            </div>
            <div className="file-preview-info">
              <div className="file-preview-name">{file.name}</div>
              <div className="file-preview-meta">
                {FOLDERS[folder]?.label} · {formatBytes(file.size)}
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {status === "uploading" && (
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-label">{progress}%</span>
        </div>
      )}

      {status === "done" && (
        <div className="alert alert-success">
          Upload complete! Redirecting...
        </div>
      )}

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "done"}
        >
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>
        <button
          className="btn btn-outline"
          onClick={reset}
          disabled={!file || status === "uploading"}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
