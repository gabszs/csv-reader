import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";
import ErrorPopup from "./components/ErrorPopup";
import FormActions from "./components/FormActions";
import InfoCard, { User } from "./components/InfoCard";
import UploadLabel from "./components/UploadLabel";

const baseURL =
  import.meta.env.MODE === "production"
    ? "https://csviewer.fly.dev"
    : "http://localhost:3000";

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
    handleFileRemoval();
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleError = async (res: Response) => {
    const data = await res.json();
    setError(data.message);
  };

  const closeWarning = () => setError("");

  useEffect(() => {
    if (search.length < 1) return setUsers([]);

    const getUsers = async (search: string) => {
      const res = await fetch(`${baseURL}/api/users?q=${search}`);

      if (!res.ok) return handleError(res);

      const data: User[] = (await res.json()).data;
      return setUsers(data);
    };

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
          data-testid="search-input"
        />

        <UploadLabel
          filename={file?.name}
          handleFileChange={handleFileChange}
        />

        <FormActions
          handleFileSubmit={handleFileSubmit}
          handleFileRemoval={handleFileRemoval}
          loading={loading}
          visible={Boolean(file)}
        />

        {error && <ErrorPopup close={closeWarning} message={error} />}
      </div>

      <section id="cards-holder">
        {users.length < 1 && (
          <div id="search-cta">
            <h1>No user found. Upload a new file or update your search!!</h1>
          </div>
        )}

        {users.map((user) => (
          <InfoCard
            name={user.name}
            city={user.city}
            country={user.country}
            favorite_sport={user.favorite_sport}
            key={user.name}
          />
        ))}
      </section>
    </main>
  );
}

export default App;
