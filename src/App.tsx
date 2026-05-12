import RegistrationForm from "./components/RegistrationForm";

export default function App() {
  const layout = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4"
  };

  return (
    <div style={layout}>
      <RegistrationForm />
    </div>
  );
}