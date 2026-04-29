
const Alert = ({ message, type = "info", center = false }) => {
    const getConfig = () => {
        switch (type) {
        case "warning":
            return {
                icon: "⚠️",
                style: {
                    backgroundColor: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #ffeeba",
                },
            };
        case "error":
            return {
                icon: "❌",
                style: {
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    border: "1px solid #f5c6cb",
                },
            };
        case "success":
            return {
                icon: "✅",
                style: {
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    border: "1px solid #c3e6cb",
                },
            };
        default:
            return {
                icon: "ℹ️",
                style: {
                    backgroundColor: "#d1ecf1",
                    color: "#0c5460",
                    border: "1px solid #bee5eb",
                },
            };
        }
    };

    const { icon, style } = getConfig();

    const styles = {
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap: "8px",
        padding: "12px 16px",
        borderRadius: "6px",
        margin: "10px 0",
        fontSize: "14px",
        ...style,
    };

    return (
        <div style={ styles }>
            <span>{ icon }</span>
            <span>{ message }</span>
        </div>
    );
};

export default Alert;