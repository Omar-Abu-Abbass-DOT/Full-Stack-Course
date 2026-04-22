import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { FOLDERS, folderForMime, formatBytes } from "../fileTypes";
import Loader from "../components/Loader";

export default function Files() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "files"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setFiles(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            folder: folderForMime(d.data().type),
          }))
        );
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return unsub;
  }, [user]);

  const counts = useMemo(() => {
    const base = { all: files.length };
    Object.keys(FOLDERS).forEach((k) => {
      base[k] = files.filter((f) => f.folder === k).length;
    });
    return base;
  }, [files]);

  const visible = useMemo(() => {
    if (activeFolder === "all") return files;
    return files.filter((f) => f.folder === activeFolder);
  }, [files, activeFolder]);

  const handleDelete = async (file) => {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;

    setDeletingId(file.id);
    try {
      await deleteObject(storageRef(storage, file.storagePath));
      await deleteDoc(doc(db, "files", file.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the file. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader text="Loading your files..." />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Files</h1>
        <p className="muted">
          Only you can view or delete the files in your vault.
        </p>
      </div>

      <div className="folders">
        <FolderTab
          active={activeFolder === "all"}
          onClick={() => setActiveFolder("all")}
          icon="📁"
          label="All"
          count={counts.all}
        />
        {Object.entries(FOLDERS).map(([key, f]) => (
          <FolderTab
            key={key}
            active={activeFolder === key}
            onClick={() => setActiveFolder(key)}
            icon={f.icon}
            label={f.label}
            count={counts[key]}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🗂️</div>
          <p>No files in this folder yet.</p>
        </div>
      ) : (
        <div className="file-grid">
          {visible.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              deleting={deletingId === file.id}
              onDelete={() => handleDelete(file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FolderTab({ active, onClick, icon, label, count }) {
  return (
    <button
      className={`folder-tab ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="folder-icon">{icon}</span>
      <span className="folder-label">{label}</span>
      <span className="folder-count">{count}</span>
    </button>
  );
}

function FileCard({ file, deleting, onDelete }) {
  const folder = FOLDERS[file.folder];

  return (
    <div className="file-card">
      <div className="file-thumb">
        {file.folder === "images" ? (
          <img src={file.downloadURL} alt={file.name} />
        ) : file.folder === "videos" ? (
          <video src={file.downloadURL} muted />
        ) : (
          <div className="file-thumb-icon">{folder?.icon ?? "📄"}</div>
        )}
      </div>

      <div className="file-body">
        <div className="file-name" title={file.name}>
          {file.name}
        </div>
        <div className="file-meta">
          {folder?.label ?? "File"} · {formatBytes(file.size)}
        </div>
      </div>

      <div className="file-actions">
        <a
          href={file.downloadURL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-outline"
        >
          Open
        </a>
        <button
          className="btn btn-sm btn-danger"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
