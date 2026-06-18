import { useState } from "react";

function NewsletterSignup({
    onSubscribe,
    source = "Website",
    tags = [],
    placeholder = "Enter your email address",
    buttonLabel = "Subscribe",
}) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const result = onSubscribe({ email, source, tags });

        setMessage(
            result.status === "existing"
                ? "You're already on the Cin Nova newsletter list."
                : "Success. You're subscribed to the Cin Nova newsletter.",
        );
        setEmail("");
    }

    return (
        <>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={placeholder}
                    required
                />
                <button type="submit">{buttonLabel}</button>
            </form>
            {message && <p className="newsletter-success">{message}</p>}
        </>
    );
}

export default NewsletterSignup;
