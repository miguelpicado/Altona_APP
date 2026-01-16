import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <img
                src={`${import.meta.env.BASE_URL}logo-altonadock.png`}
                alt="Altonadock"
                className="header-logo"
            />

            {user && (
                <div className="header-user">
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {user.displayName?.split(' ')[0]}
                    </span>
                    {user.photoURL && (
                        <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="header-avatar"
                            onClick={logout}
                            title="Cerrar sesión"
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </div>
            )}
        </header>
    );
}
