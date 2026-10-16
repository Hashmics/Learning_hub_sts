import { Link } from "react-router-dom";

const reasons = [
  "Browse courses and open any course for the full details.",
  "Students can enroll with one click after they log in.",
  "Instructors can add, update, and delete their own courses."
];

function Home() {
  return (
    <div className="page">
      <div className="hero">
        <h1>Welcome to LearnHub</h1>
        <p>Learn new skills with courses taught by instructors.</p>
      </div>

      <h2>Why Choose LearnHub?</h2>
      <ul>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <Link to="/courses">
        <button>Explore Courses</button>
      </Link>
    </div>
  );
}

export default Home;
