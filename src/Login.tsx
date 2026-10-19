
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, UserRound, Factory } from 'lucide-react';
import { api, errorMessage } from './api';

export default function Login({
    onLogin,

}: {
    onLogin: () => void;

}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post<{ token: string }>('/login/', {
        username: username.trim(),
        password,
      });

      localStorage.setItem('wip_token', response.data.token);
      onLogin();
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error && 'response' in err
          ? 'Usuario o contraseña incorrectos, o no se pudo conectar con el servidor.'
          : errorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.logo}>
          <Factory size={32} strokeWidth={1.8} />
        </div>

        <h1 style={styles.title}>INPLAZ WIP</h1>
        <p style={styles.subtitle}>Sistema de trazabilidad de producción</p>

        <div style={styles.divider} />

        <h2 style={styles.welcome}>Bienvenida al sistema</h2>
        <p style={styles.description}>
          Ingresa tus credenciales para continuar.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="username" style={styles.label}>
            Usuario
          </label>

          <div style={styles.inputWrapper}>
            <UserRound size={19} style={styles.inputIcon} />
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={styles.input}
            />
          </div>

          <label htmlFor="password" style={styles.label}>
            Contraseña
          </label>

          <div style={styles.inputWrapper}>
            <LockKeyhole size={19} style={styles.inputIcon} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && (
            <div role="alert" style={styles.error}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={styles.footer}>
          INPLAZ SRL · Control y seguimiento de producción
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxSizing: 'border-box',
    background: 'linear-gradient(135deg, #eef7f1 0%, #f3f6fb 100%)',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    boxSizing: 'border-box',
    background: '#ffffff',
    padding: '36px 32px 24px',
    borderRadius: '20px',
    border: '1px solid #e4ebe7',
    boxShadow: '0 18px 55px rgba(23, 57, 42, 0.09)',
  },
  logo: {
    width: '62px',
    height: '62px',
    margin: '0 auto 14px',
    borderRadius: '17px',
    background: '#e5f5e9',
    color: '#238447',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 0,
    textAlign: 'center',
    color: '#193b2a',
    fontSize: '27px',
    fontWeight: 800,
    letterSpacing: '1.2px',
  },
  subtitle: {
    margin: '8px 0 0',
    textAlign: 'center',
    color: '#718078',
    fontSize: '13px',
  },
  divider: {
    height: '1px',
    background: '#e9efeb',
    margin: '25px 0',
  },
  welcome: {
    margin: 0,
    color: '#263a30',
    fontSize: '21px',
    fontWeight: 700,
  },
  description: {
    margin: '8px 0 24px',
    color: '#748078',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    color: '#34483c',
    fontSize: '13px',
    fontWeight: 650,
    marginTop: '5px',
  },
  inputWrapper: {
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #dce5df',
    borderRadius: '10px',
    padding: '0 12px',
    background: '#fff',
  },
  inputIcon: {
    flexShrink: 0,
    color: '#819087',
  },
  input: {
    width: '100%',
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#24372c',
    fontSize: '14px',
    padding: '13px 0',
  },
  eyeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    color: '#718078',
    padding: '5px',
    cursor: 'pointer',
  },
  error: {
    background: '#fff0f0',
    color: '#b42318',
    border: '1px solid #ffd5d2',
    borderRadius: '9px',
    padding: '11px',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  submit: {
    marginTop: '12px',
    minHeight: '48px',
    border: 'none',
    borderRadius: '10px',
    background: '#238447',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  footer: {
    margin: '25px 0 0',
    textAlign: 'center',
    color: '#8a968e',
    fontSize: '11px',
    lineHeight: 1.6,
  },
};
