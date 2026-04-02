import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import jsPDF from "jspdf";
import logo from "../assets/logo.jpg";

const internshipList = {
  1: "Python Developer Internship",
  2: "Web Development Internship",
  3: "AI & Machine Learning Internship"
};

const internshipIcons = {
  1: "🐍",
  2: "🌐",
  3: "🤖"
};

const internshipDescriptions = {
  1: "Learn Python programming fundamentals and build real-world applications. Master object-oriented programming, data structures, and best practices.",
  2: "Become a full-stack web developer. Learn frontend technologies like React and backend frameworks to build complete web applications.",
  3: "Dive into AI and machine learning. Understand algorithms, neural networks, and how to build intelligent systems with Python."
};

const modulesList = {
  1: [
    { 
      num: 1, 
      title: "Python Basics", 
      icon: "📖", 
      duration: "1 week",
      content: `Welcome to Python Basics! In this module, you'll learn:

• Introduction to Python programming language
• Setting up your development environment
• Python syntax and data types (strings, integers, floats, booleans)
• Variables and constants
• Basic operations and expressions
• Input and output operations
• Comments and documentation

Key Concepts:
Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, artificial intelligence, and more.

Practical Skills:
- Write your first Python program
- Understand how Python interprets code
- Work with different data types
- Perform basic calculations
- Get user input and display output

By the end of this module, you'll be comfortable with Python fundamentals and ready to move on to more complex concepts.`
    },
    { 
      num: 2, 
      title: "Core Concepts", 
      icon: "🔧", 
      duration: "1 week",
      content: `Master the Core Concepts of Python programming:

• Control flow statements (if, elif, else)
• Loops (for, while, break, continue)
• Functions and return values
• Function parameters and arguments
• Scope and namespaces
• Modules and imports
• Error handling with try-except

Key Concepts:
Control structures allow you to decide what code to execute based on conditions. Functions enable code reusability and better organization of your programs.

Practical Skills:
- Write conditional statements
- Create loops to iterate over data
- Define and call functions
- Handle errors gracefully
- Organize code using modules
- Import built-in and custom modules

Advanced Topics:
- Lambda functions
- List comprehensions
- Decorators (introduction)

By the end of this module, you'll have a solid understanding of Python's core programming constructs.`
    },
    { 
      num: 3, 
      title: "Project Development", 
      icon: "🚀", 
      duration: "2 weeks",
      content: `Build Real-World Python Projects:

• Project planning and design
• Working with files and directories
• Data manipulation and analysis
• Building a simple command-line application
• Debugging and testing your code
• Performance optimization
• Best practices and design patterns

Project Ideas:
1. Calculator Application - Build a feature-rich calculator
2. File Manager - Create a program to organize files
3. Data Analyzer - Read CSV files and analyze data
4. Todo App - Build a task management system
5. Game Development - Create a simple game using Python

Key Concepts:
Real-world projects combine all the concepts you've learned so far. They teach you how to structure your code, plan features, and deliver a complete application.

Practical Skills:
- Read and write files
- Work with data structures (lists, dictionaries, sets)
- Create reusable components
- Debug issues efficiently
- Test your code thoroughly
- Document your work

Best Practices:
- Write clean, readable code
- Follow PEP 8 style guidelines
- Add meaningful comments
- Create comprehensive tests
- Version control with Git

By the end of this module, you'll have completed a full project and be ready for internship work!`
    }
  ],
  2: [
    { 
      num: 1, 
      title: "Frontend Fundamentals", 
      icon: "🎨", 
      duration: "2 weeks",
      content: `Master Frontend Web Development Fundamentals:

• HTML5 structure and semantics
• CSS3 styling and layouts
• Responsive design principles
• Flexbox and CSS Grid
• CSS preprocessors (SASS/SCSS)
• Web fonts and typography
• Accessibility best practices

Key Concepts:
HTML provides structure, CSS provides styling, and together they create the visual experience users see in their browsers.

HTML Topics:
- Semantic HTML tags
- Forms and input elements
- Audio and video embedding
- Meta tags and SEO
- HTML best practices

CSS Topics:
- Box model and positioning
- Flexbox layouts
- CSS Grid layouts
- Media queries for responsiveness
- Animations and transitions
- CSS variables and functions

Practical Skills:
- Create semantic HTML documents
- Style web pages with modern CSS
- Build responsive layouts
- Optimize for mobile devices
- Ensure accessibility compliance
- Create smooth animations

By completing this module, you'll have solid foundation in frontend technologies!`
    },
    { 
      num: 2, 
      title: "React & Modern JS", 
      icon: "⚛️", 
      duration: "2 weeks",
      content: `Learn Modern JavaScript and React Framework:

• ES6+ JavaScript features
• Asynchronous programming (Promises, async/await)
• DOM manipulation
• React basics and components
• JSX syntax
• State and props
• Hooks (useState, useEffect, custom hooks)
• Component lifecycle

React Fundamentals:
- Functional components
- Class components
- Component composition
- Lifting state up
- Conditional rendering
- Lists and keys

Advanced React:
- Custom hooks
- Context API
- Refs
- Performance optimization
- Code splitting

Modern JavaScript:
- Arrow functions
- Destructuring
- Spread operator
- Template literals
- Async/await patterns

Practical Skills:
- Build interactive React applications
- Manage component state effectively
- Create reusable components
- Handle asynchronous operations
- Optimize component performance
- Debug React applications

By the end of this module, you'll be proficient in building modern web applications with React!`
    },
    { 
      num: 3, 
      title: "Backend Development", 
      icon: "🔌", 
      duration: "2 weeks",
      content: `Master Backend Development:

• Node.js and Express.js
• RESTful API design
• Database fundamentals (SQL and NoSQL)
• Authentication and authorization
• Middleware and routing
• Error handling and logging
• Deployment and DevOps basics

Backend Concepts:
- Server-side programming
- API design patterns
- Data persistence
- User authentication
- Session management
- Security best practices

Express.js Topics:
- Creating routes
- Handling requests and responses
- Middleware functions
- Error handling
- Static file serving
- Request validation

Database Topics:
- SQL basics (CREATE, READ, UPDATE, DELETE)
- MongoDB and document databases
- Relationships and normalization
- Indexing and queries
- Data backup and recovery

Security:
- Password hashing
- JWT tokens
- CORS policies
- Input validation
- SQL injection prevention
- XSS protection

Practical Skills:
- Build REST APIs
- Connect to databases
- Implement user authentication
- Deploy applications
- Monitor and debug servers
- Optimize database queries

By the end of this module, you'll be able to build complete full-stack applications!`
    }
  ],
  3: [
    { 
      num: 1, 
      title: "ML Fundamentals", 
      icon: "📊", 
      duration: "2 weeks",
      content: `Master Machine Learning Fundamentals:

• What is Machine Learning?
• Supervised vs Unsupervised learning
• Linear and logistic regression
• Decision trees
• Data preprocessing and cleaning
• Feature engineering
• Train-test split
• Model evaluation metrics

ML Concepts:
Machine Learning enables computers to learn from data and make predictions without being explicitly programmed for every scenario.

Key Topics:
- Supervised Learning: Learning with labeled data
- Unsupervised Learning: Finding patterns in unlabeled data
- Training and testing
- Overfitting and underfitting
- Cross-validation

Algorithms:
- Linear Regression for continuous predictions
- Logistic Regression for classification
- Decision Trees for rule-based learning
- K-Nearest Neighbors for instance-based learning
- Naive Bayes for probabilistic learning

Python Libraries:
- NumPy for numerical computing
- Pandas for data manipulation
- Scikit-learn for ML algorithms
- Matplotlib for visualization

Practical Skills:
- Load and explore datasets
- Preprocess and clean data
- Engineer meaningful features
- Train ML models
- Evaluate model performance
- Make predictions on new data

By the end of this module, you'll understand the foundations of machine learning!`
    },
    { 
      num: 2, 
      title: "Neural Networks", 
      icon: "🧠", 
      duration: "3 weeks",
      content: `Deep Dive into Neural Networks and Deep Learning:

• Artificial Neural Networks (ANN)
• Neurons and activation functions
• Backpropagation algorithm
• Gradient descent optimization
• Convolutional Neural Networks (CNN)
• Recurrent Neural Networks (RNN)
• TensorFlow and Keras
• GPU acceleration

Neural Network Architecture:
- Input layer
- Hidden layers
- Output layer
- Weights and biases
- Forward and backward propagation

Activation Functions:
- ReLU (Rectified Linear Unit)
- Sigmoid
- Tanh
- Softmax for multi-class classification

Deep Learning Concepts:
- Convolutional layers for image processing
- Pooling layers for feature reduction
- LSTM cells for sequence processing
- Attention mechanisms
- Batch normalization

Frameworks:
- TensorFlow fundamentals
- Keras high-level API
- Building custom models
- Training and evaluation
- Model persistence

Practical Applications:
- Image classification
- Natural language processing
- Time series prediction
- Object detection
- Generative models

Practical Skills:
- Design neural network architectures
- Train deep learning models
- Optimize hyperparameters
- Use pre-trained models
- Handle large datasets
- Troubleshoot training issues

By the end of this module, you'll be ready to tackle complex AI problems!`
    },
    { 
      num: 3, 
      title: "Real-world Projects", 
      icon: "🎯", 
      duration: "3 weeks",
      content: `Build Real-World AI & ML Applications:

• Image classification project
• Natural language processing project
• Time series forecasting project
• Recommendation system
• Data science pipeline
• Model deployment
• Performance monitoring

Project 1: Image Classification
- Build a CNN to classify images
- Use transfer learning with pre-trained models
- Handle image preprocessing
- Deploy as a web service

Project 2: NLP Text Classification
- Sentiment analysis on reviews
- Text preprocessing and tokenization
- Word embeddings (Word2Vec, GloVe)
- LSTM for sequence understanding

Project 3: Time Series Prediction
- Predict stock prices or weather
- Handle temporal dependencies
- Evaluate forecast accuracy
- Visualize predictions

Project 4: Recommendation System
- Collaborative filtering
- Content-based recommendations
- Building personalized systems
- A/B testing recommendations

Advanced Topics:
- Model interpretability (LIME, SHAP)
- Ethical AI and bias detection
- Privacy-preserving ML
- Federated learning basics
- ML in production

Deployment:
- Containerization with Docker
- Cloud platforms (AWS, Google Cloud)
- API serving with Flask/FastAPI
- Monitoring and logging
- Continuous improvement

Practical Skills:
- Complete end-to-end ML projects
- Handle real-world messy data
- Optimize models for performance
- Deploy to production
- Monitor model performance
- Iterate and improve systems

Capstone Project:
Combine all your knowledge to build a complete AI application that solves a real problem!`
    }
  ]
};

function InternshipDetails({ darkMode }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [enrollmentDocId, setEnrollmentDocId] = useState(null);

  useEffect(() => {

    const checkEnrollment = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // check enrollment
        const q = query(
          collection(db, "enrollments"),
          where("userId", "==", user.uid),
          where("internshipId", "==", id)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {

        setAlreadyPurchased(true);
        const doc = querySnapshot.docs[0];
        setEnrollmentDocId(doc.id);

        const enrollmentData = doc.data();

        if (enrollmentData.completed === true) {
          setIsCompleted(true);
        }

        // Load completed modules from Firestore
        if (enrollmentData.completedModules && Array.isArray(enrollmentData.completedModules)) {
          setCompletedModules(new Set(enrollmentData.completedModules));
        }

      }

      // get student name
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        setStudentName(userDoc.data().name);
      }
    } catch (error) {
      console.error("Internship details error:", error);
      alert("Error loading internship details: " + (error.message || error));
    }
    };

    checkEnrollment();

  }, [id]);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(db, "courses", id));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        } else {
          setCourse({
            id,
            title: internshipList[id] || "Unknown Internship",
            icon: internshipIcons[id] || "📘",
            description: internshipDescriptions[id] || "Description not found",
            modules: modulesList[id] || []
          });
        }
      } catch (error) {
        console.error("Error loading course:", error);
      }
    };
    loadCourse();
  }, [id]);

  const enrollUser = () => {

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    // Redirect to payment page
    navigate(`/payment/${id}`);

  };

  const activeModules = (course?.modules || modulesList[id] || []).map((module, index) => ({
    num: module.num != null ? module.num : index + 1,
    icon: module.icon || "📘",
    title: module.title || `Module ${index + 1}`,
    duration: module.duration || "",
    content: module.content || "",
    ...module
  }));

  const completeModule = async (moduleNum) => {

    if (!enrollmentDocId) return;

    const targetModuleNum = moduleNum != null ? moduleNum : selectedModule?.num;
    if (targetModuleNum == null || Number.isNaN(Number(targetModuleNum))) {
      alert("Unable to mark module complete: module identifier is invalid.");
      return;
    }

    const newCompletedModules = new Set(completedModules);
    newCompletedModules.add(targetModuleNum);
    
    const totalModules = activeModules.length || 1;
    const newProgress = Math.round((newCompletedModules.size / totalModules) * 100);

    setLoading(true);

    try {
      const docRef = doc(db, "enrollments", enrollmentDocId);
      
      // Check if all modules are completed
      const allCompleted = newCompletedModules.size === totalModules;

      await updateDoc(docRef, {
        completedModules: Array.from(newCompletedModules),
        progress: newProgress,
        ...(allCompleted && { completed: true })
      });

      setCompletedModules(newCompletedModules);
      
      if (allCompleted) {
        setIsCompleted(true);
        alert("🎉 Congratulations! You've completed all modules!");
      } else {
        alert(`Module ${moduleNum} completed! Progress: ${newProgress}%`);
      }

      setSelectedModule(null);
    } catch (error) {
      alert("Error updating progress: " + error.message);
    } finally {
      setLoading(false);
    }

  };

  const generateCertificate = () => {

    const courseName = course?.title || internshipList[id];

    const certID =
      "CERT-" +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    const pdf = new jsPDF("landscape");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const today = new Date().toLocaleDateString();

    // background
    pdf.setFillColor(240, 248, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // borders
    pdf.setLineWidth(2);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // logo
    pdf.addImage(logo, "JPEG", pageWidth / 2 - 20, 20, 40, 20);

    // platform
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("InternHelp", pageWidth / 2, 35, { align: "center" });

    // title
    pdf.setFont("times", "bold");
    pdf.setFontSize(32);
    pdf.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 65, { align: "center" });

    // subtitle
    pdf.setFontSize(16);
    pdf.setFont("times", "normal");
    pdf.text("This certificate is proudly presented to", pageWidth / 2, 90, { align: "center" });

    // student name
    pdf.setFont("times", "bold");
    pdf.setFontSize(26);
    pdf.text(studentName, pageWidth / 2, 110, { align: "center" });

    // completion
    pdf.setFont("times", "normal");
    pdf.setFontSize(16);
    pdf.text("for successfully completing the internship", pageWidth / 2, 130, { align: "center" });

    // course
    pdf.setFont("times", "bold");
    pdf.setFontSize(20);
    pdf.text(courseName, pageWidth / 2, 150, { align: "center" });

    // certificate ID
    pdf.setFontSize(14);
    pdf.text(`Certificate ID: ${certID}`, pageWidth / 2, 170, { align: "center" });

    // footer
    pdf.text(`Date: ${today}`, 30, pageHeight - 25);
    pdf.text("Authorized Signature", pageWidth - 80, pageHeight - 25);

    pdf.save("certificate.pdf");

  };

  // Module Reading Interface
  if (selectedModule) {
    return (
      <div style={{
        background: darkMode
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: "30px 20px"
      }}>
        <style>{`
          .content-text {
            white-space: pre-wrap;
            word-break: break-word;
          }
        `}</style>

        <div style={{
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          {/* Header */}
          <div style={{
            background: darkMode ? "#2a2a4a" : "white",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px"
          }}>
            <div>
              <h1 style={{
                margin: "0",
                color: darkMode ? "white" : "#333",
                fontSize: "28px",
                fontWeight: "800"
              }}>
                {selectedModule.icon} Module {selectedModule.num}: {selectedModule.title}
              </h1>
              <p style={{
                margin: "8px 0 0 0",
                color: darkMode ? "#aaa" : "#666",
                fontSize: "14px"
              }}>
                Duration: {selectedModule.duration}
              </p>
            </div>
            <button
              onClick={() => setSelectedModule(null)}
              style={{
                background: "white",
                border: "2px solid #667eea",
                color: "#667eea",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#667eea";
              }}
            >
              ← Back to Modules
            </button>
          </div>

          {/* Content */}
          <div style={{
            background: darkMode ? "#2a2a4a" : "white",
            borderRadius: "15px",
            padding: "40px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            lineHeight: "1.8"
          }}>
            <div className="content-text" style={{
              color: darkMode ? "#ddd" : "#333",
              fontSize: "15px",
              fontFamily: "Georgia, serif",
              marginBottom: "30px"
            }}>
              {selectedModule.content}
            </div>

            {/* Mark Completed Button */}
            <div style={{
              borderTop: "2px solid #e0e0e0",
              paddingTop: "30px"
            }}>
              <button
                onClick={() => completeModule(selectedModule.num)}
                disabled={loading || completedModules.has(selectedModule.num)}
                style={{
                  width: "100%",
                  padding: "15px 30px",
                  background: completedModules.has(selectedModule.num) 
                    ? "#ccc" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: completedModules.has(selectedModule.num) ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                }}
                onMouseEnter={(e) => {
                  if (!completedModules.has(selectedModule.num) && !loading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!completedModules.has(selectedModule.num) && !loading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                  }
                }}
              >
                {loading ? "Processing..." : completedModules.has(selectedModule.num) ? "✅ Module Completed" : "✅ Mark as Completed"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: darkMode
        ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "30px 20px",
      paddingTop: "0"
    }}>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .module-card {
          animation: fadeInUp 0.6s ease forwards;
          transition: all 0.3s ease;
        }
        .module-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
        }
      `}</style>

      {/* Back Button & Header */}
      <div style={{
        background: darkMode ? "#2a2a4a" : "rgba(255, 255, 255, 0.95)",
        padding: "20px 40px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        borderRadius: "0 0 15px 15px",
        boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
        marginBottom: "40px"
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: darkMode ? "#1a1a2e" : "white",
            border: "2px solid #667eea",
            color: "#667eea",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#667eea";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = darkMode ? "#1a1a2e" : "white";
            e.target.style.color = "#667eea";
          }}
        >
          ← Back
        </button>
        <h2 style={{
          color: darkMode ? "white" : "#667eea",
          fontSize: "22px",
          fontWeight: "800",
          margin: "0"
        }}>
          Internship Details
        </h2>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {/* Hero Card */}
        <div style={{
          background: darkMode ? "#2a2a4a" : "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          marginBottom: "40px",
          animation: "fadeInUp 0.6s ease"
        }}>
          {/* Header Background */}
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "50px 30px",
            textAlign: "center",
            color: "white"
          }}>
            <div style={{
              fontSize: "60px",
              marginBottom: "20px"
            }}>
              {course?.icon || internshipIcons[id] || "📘"}
            </div>
            <h1 style={{
              margin: "0 0 15px 0",
              fontSize: "32px",
              fontWeight: "800",
              letterSpacing: "-0.5px"
            }}>
              {course?.title || internshipList[id]}
            </h1>
            <p style={{
              margin: "0",
              fontSize: "15px",
              opacity: 0.9
            }}>
              {course?.description || internshipDescriptions[id]}
            </p>
          </div>

          {/* Progress Bar */}
          {alreadyPurchased && (
            <div style={{
              background: darkMode ? "#1a1a2e" : "#f5f5f5",
              padding: "20px 30px",
              borderBottom: darkMode ? "1px solid #444" : "1px solid #e0e0e0"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}>
                <h3 style={{
                  margin: "0",
                  color: darkMode ? "white" : "#333",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  Your Progress
                </h3>
                <span style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "#667eea"
                }}>
                  {activeModules.length > 0 ? Math.round((completedModules.size / activeModules.length) * 100) : 0}%
                </span>
              </div>
              <div style={{
                background: darkMode ? "#444" : "#e0e0e0",
                borderRadius: "10px",
                height: "12px",
                overflow: "hidden"
              }}>
                <div style={{
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  height: "100%",
                  width: `${activeModules.length > 0 ? Math.round((completedModules.size / activeModules.length) * 100) : 0}%`,
                  transition: "width 0.5s ease",
                  borderRadius: "10px"
                }} />
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{
            padding: "40px 30px",
            background: darkMode ? "#2a2a4a" : "white"
          }}>
            {/* Modules Section */}
            <div style={{
              marginBottom: "40px"
            }}>
              <h2 style={{
                color: darkMode ? "white" : "#333",
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "25px",
                paddingBottom: "15px",
                borderBottom: darkMode ? "2px solid #444" : "2px solid #f0f0f0"
              }}>
                📚 Course Modules
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px"
              }}>
                {activeModules.map((module, index) => (
                  <div
                    key={index}
                    className="module-card"
                    style={{
                      background: completedModules.has(module.num) 
                        ? (darkMode ? "#1a4620" : "#d4edda")
                        : (darkMode ? "#2a2a4a" : "#f9f9f9"),
                      borderRadius: "12px",
                      padding: "25px",
                      border: completedModules.has(module.num) 
                        ? "2px solid #28a745"
                        : (darkMode ? "2px solid #444" : "2px solid #e0e0e0"),
                      cursor: alreadyPurchased ? "pointer" : "default",
                      animationDelay: `${index * 0.1}s`
                    }}
                    onClick={() => alreadyPurchased && setSelectedModule(module)}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px"
                    }}>
                      <div style={{
                        fontSize: "40px"
                      }}>
                        {module.icon}
                      </div>
                      {completedModules.has(module.num) && (
                        <div style={{
                          fontSize: "24px"
                        }}>
                          ✅
                        </div>
                      )}
                    </div>
                    <h3 style={{
                      color: darkMode ? "white" : "#333",
                      fontSize: "16px",
                      fontWeight: "700",
                      margin: "0 0 8px 0"
                    }}>
                      Module {module.num}: {module.title}
                    </h3>
                    <p style={{
                      color: darkMode ? "#aaa" : "#666",
                      fontSize: "13px",
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}>
                      ⏱️ {module.duration}
                    </p>
                    {alreadyPurchased && (
                      <p style={{
                        color: completedModules.has(module.num) ? "#28a745" : "#667eea",
                        fontSize: "12px",
                        margin: "12px 0 0 0",
                        fontWeight: "600"
                      }}>
                        {completedModules.has(module.num) ? "✓ Completed" : "Click to start →"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div style={{
              background: darkMode ? "#1a1a2e" : "#f0f4ff",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "30px"
            }}>
              <h3 style={{
                color: darkMode ? "white" : "#333",
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "15px",
                margin: "0 0 15px 0"
              }}>
                ✨ What You'll Get
              </h3>
              <ul style={{
                margin: "0",
                padding: "0 0 0 20px",
                listStyle: "none"
              }}>
                {[
                  "Hands-on project experience",
                  "Industry-standard curriculum",
                  "Certificate of completion",
                  "Lifetime access to materials",
                  "Expert mentoring"
                ].map((feature, idx) => (
                  <li key={idx} style={{
                    color: darkMode ? "#aaa" : "#555",
                    fontSize: "14px",
                    marginBottom: "10px",
                    paddingLeft: "20px",
                    position: "relative"
                  }}>
                    <span style={{
                      position: "absolute",
                      left: "0",
                      color: "#667eea",
                      fontWeight: "700"
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap"
            }}>
              {!alreadyPurchased && (
                <button
                  onClick={enrollUser}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "14px 30px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  💳 Purchase Internship
                </button>
              )}

              {isCompleted && (
                <button
                  onClick={generateCertificate}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "14px 30px",
                    background: "linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(52, 168, 83, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(52, 168, 83, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(52, 168, 83, 0.3)";
                  }}
                >
                  🎓 Download Certificate
                </button>
              )}
            </div>

            {/* Status Badge */}
            {alreadyPurchased && (
              <div style={{
                marginTop: "25px",
                padding: "15px 20px",
                background: isCompleted ? "#d4edda" : (darkMode ? "#1a3a52" : "#e7f3ff"),
                borderRadius: "10px",
                textAlign: "center",
                border: `2px solid ${isCompleted ? "#28a745" : (darkMode ? "#0066cc" : "#004085")}`,
                color: isCompleted ? "#155724" : (darkMode ? "#66b3ff" : "#004085"),
                fontWeight: "600",
                fontSize: "14px"
              }}>
                {isCompleted 
                  ? "🎉 Internship Completed - Certificate Ready!" 
                  : `📖 Complete all ${activeModules.length} modules to finish this internship`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;