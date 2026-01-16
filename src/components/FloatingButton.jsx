export default function FloatingButton({ onClick }) {
    return (
        <button
            className="fab"
            onClick={onClick}
            aria-label="Añadir venta"
        >
            +
        </button>
    );
}
