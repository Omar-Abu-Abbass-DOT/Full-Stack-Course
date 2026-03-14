import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <Header />

      <main className="cards-container">
        {/* البطاقة الأولى */}
        <Card 
          title="HTML5" 
          image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" 
        />
        
        {/* البطاقة الثانية */}
        <Card 
          title="CSS3" 
          image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" 
        />
        
        {/* البطاقة الثالثة */}
        <Card 
          title="JavaScript" 
          image="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" 
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;