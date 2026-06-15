import "../App.css";

function StudyNest() {
    return ( <
        div className = "product-page" >
        <
        section className = "studynest-hero" >
        <
        div >
        <
        p className = "eyebrow" > STUDYNEST < /p> <
        h1 > AI - powered studying
        for modern students. < /h1> <
        p className = "hero-text" >
        StudyNest helps students organize notes, generate flashcards, take quizzes, create study guides, and get AI tutoring support in one connected workspace. <
        /p>

        <
        div className = "hero-actions" >
        <
        a href = "#waitlist"
        className = "primary-btn" > Join Waitlist < /a> <
        a href = "#features"
        className = "secondary-btn" > View Features < /a> <
        /div> <
        /div>

        <
        div className = "app-preview" >
        <
        div className = "preview-header" >
        <
        h3 > StudyNest Dashboard < /h3> <
        button > New Note < /button> <
        /div>

        <
        div className = "preview-grid" >
        <
        div > < strong > 24 < /strong><span>Notes</span > < /div> <
        div > < strong > 132 < /strong><span>Flashcards</span > < /div> <
        div > < strong > 18 < /strong><span>Quizzes</span > < /div> <
        div > < strong > Ready < /strong><span>AI Tutor</span > < /div> <
        /div>

        <
        div className = "preview-note" >
        <
        p > Biology Notes < /p> <
        h4 > Photosynthesis Study Guide < /h4> <
        span >
        Plants convert sunlight into energy using chlorophyll, carbon dioxide, and water. <
        /span> <
        /div> <
        /div> <
        /section>

        <
        section className = "section"
        id = "features" >
        <
        div className = "section-heading" >
        <
        p className = "eyebrow" > FEATURES < /p> <
        h2 > Everything students need in one study workspace < /h2> <
        /div>

        <
        div className = "product-grid" >
        <
        article className = "product-card" >
        <
        div className = "product-icon" > 📝 < /div> <
        h3 > Smart Notes < /h3> <
        p > Organize class notes by subject, course, and topic. < /p> <
        /article>

        <
        article className = "product-card" >
        <
        div className = "product-icon" > 🧠 < /div> <
        h3 > AI Tutor < /h3> <
        p > Ask questions and get simple explanations when studying. < /p> <
        /article>

        <
        article className = "product-card" >
        <
        div className = "product-icon" > 🎴 < /div> <
        h3 > Flashcards < /h3> <
        p > Turn notes into flashcards
        for active recall. < /p> <
        /article>

        <
        article className = "product-card" >
        <
        div className = "product-icon" > ✅ < /div> <
        h3 > Quiz Generator < /h3> <
        p > Practice with quizzes before exams. < /p> <
        /article> <
        /div> <
        /section>

        <
        section className = "section showcase-section" >
        <
        div className = "section-heading" >
        <
        p className = "eyebrow" > PRODUCT PREVIEW < /p> <
        h2 > Study tools that feel simple and useful < /h2> <
        /div>

        <
        div className = "showcase-grid" >
        <
        div className = "showcase-card" >
        <
        h3 > AI Tutor Chat < /h3> <
        div className = "chat-user" > What is photosynthesis ? < /div> <
        div className = "chat-ai" >
        Photosynthesis is how plants use sunlight to make food from carbon dioxide and water. <
        /div> <
        /div>

        <
        div className = "showcase-card" >
        <
        h3 > Flashcard Review < /h3> <
        div className = "flashcard-preview" >
        <
        p > What is active recall ? < /p> <
        strong > Testing yourself instead of only rereading. < /strong> <
        /div> <
        /div> <
        /div> <
        /section>

        <
        section className = "section pricing-section" >
        <
        div className = "section-heading" >
        <
        p className = "eyebrow" > PRICING < /p> <
        h2 > Simple plans
        for students < /h2> <
        /div>

        <
        div className = "pricing-grid" >
        <
        div className = "pricing-card" >
        <
        h3 > Free < /h3> <
        div className = "price" > $0 < /div> <
        p > Basic notes, flashcards, and starter quizzes. < /p> <
        /div>

        <
        div className = "pricing-card featured" >
        <
        h3 > Student Pro < /h3> <
        div className = "price" > $9 .99 / mo < /div> <
        p > AI Tutor, unlimited notes, quizzes, and study guides. < /p> <
        /div>

        <
        div className = "pricing-card" >
        <
        h3 > School Plan < /h3> <
        div className = "price" > Coming Soon < /div> <
        p > Teacher tools, classrooms, and student progress features. < /p> <
        /div> <
        /div> <
        /section>

        <
        section className = "section"
        id = "waitlist" >
        <
        div className = "newsletter-card" >
        <
        p className = "eyebrow" > JOIN THE WAITLIST < /p> <
        h2 > Be first to
        try StudyNest when it launches. < /h2> <
        div className = "signup-form" >
        <
        input type = "email"
        placeholder = "Enter your email address" / >
        <
        button > Join Waitlist < /button> <
        /div> <
        /div> <
        /section> <
        /div>
    );
}

export default StudyNest;