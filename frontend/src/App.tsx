import {
  faBasketball,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVRow } from "@shared/types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";

const baseURL = "http://localhost:3000";

interface User extends CSVRow {
  id: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    const newfile = e.currentTarget.files?.item(0) as File;
    setFile(newfile);
  };

  const handleFileRemoval = () => {
    setFile(null);
  };

  const handleFileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    const res = await fetch(baseURL + "/api/files", {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    if (!res.ok) handleError(res);
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleError = async (res: Response) => {
    const data = await res.json();
    setError(data.message);
  };

  const closeWarning = () => setError("");

  const getUsers = async (search: string) => {
    setLoading(true);
    const res = await fetch(`${baseURL}/api/users?q=${search}`);

    if (!res.ok) return handleError(res);

    const data: User[] = (await res.json()).data;
    return setUsers(data);
  };

  useEffect(() => {
    if (search.length < 1) return setUsers([]);

    const timeoutID = setTimeout(() => {
      getUsers(search);
    }, 400);

    return () => clearTimeout(timeoutID);
  }, [search]);

  return (
    <main>
      <div id="actionables">
        <input
          name="search"
          type="text"
          value={search}
          placeholder="Search"
          onChange={handleSearch}
        />
        <label className="upload-label">
          <input
            key={file?.name}
            type="file"
            accept="text/csv"
            onChange={handleFileChange}
          />
          Upload
        </label>

        <form
          id="file-actions"
          className={file ? "shared-wd" : ""}
          onSubmit={handleFileSubmit}
        >
          <button
            className="file-action"
            type="button"
            id="eject-file"
            title="Remove CSV file"
            onClick={handleFileRemoval}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <button
            disabled={loading}
            className="file-action"
            type="submit"
            title={`Submit${loading ? "ting" : ""} CSV file`}
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>
        </form>

        {error && (
          <div id="error">
            <p>{error}</p>
            <button type="button" title="Remove error warning">
              <FontAwesomeIcon icon={faXmark} onClick={closeWarning} />
            </button>
          </div>
        )}
      </div>

      <section id="cards-holder">
        {users.length < 1 && (
          <div id="search-cta">
            <h1>No user found. Upload a new file or update your search!</h1>
          </div>
        )}

        {users.map((user) => (
          <div className="info-card" data-testid="info-card" key={user.id}>
            <div className="info-item">
              <FontAwesomeIcon icon={faUser} />
              <h1 className="info-item">{user.name}</h1>
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faHome} />
              <p className="info-item">
                {user.city}, {user.country}
              </p>
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faBasketball} />
              <p className="info-item"> {user.favorite_sport} </p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
