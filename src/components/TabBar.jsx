export default function TabBar({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: '📊' },
        { id: 'venta', label: 'Venta', icon: '✅' },
        { id: 'registro', label: 'Diario', icon: '📅' }
    ];

    return (
        <nav className="tab-bar">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
