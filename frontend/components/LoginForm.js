import { useState } from "react";
import axios from "../utils/api";
import { useRouter } from "next/router"; // Importer useRouter

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialiser useRouter

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });

      // Sauvegarde du token dans le localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Connexion réussie ! 🎉");
      
      // Redirection vers le dashboard
      router.push("/auth/dashboard"); // Ajouter la redirection
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur lors de la connexion ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          Connexion <span role="img" aria-label="lock">🔒</span>
        </h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Se connecter</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #4e73df, #2e59d9)', // Dégradé de fond pour un effet moderne
    padding: '10px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    animation: 'fadeIn 1s ease-out',
  },
  title: {
    color: '#333',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '25px', // Espacement plus large
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px', // Espacement entre les champs
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    marginBottom: '10px', // Ajout d'espacement entre les inputs
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#f9f9f9',
  },
  inputFocus: {
    borderColor: '#4e73df',
    boxShadow: '0 0 8px rgba(78, 115, 223, 0.5)',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4e73df',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 8px rgba(78, 115, 223, 0.2)',
  },
  buttonHover: {
    backgroundColor: '#2e59d9',
  },
  message: {
    color: '#d9534f',
    fontSize: '14px',
    marginTop: '15px',
    fontWeight: 'bold',
  },
};
