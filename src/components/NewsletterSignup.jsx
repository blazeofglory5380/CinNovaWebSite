import { useState } from "react";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";

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
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setMessage("Please enter a valid email address.");
            return;
        }
        const result = onSubscribe({ email: normalizedEmail, source, tags });

        setMessage(
            result?.status === "existing"
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
                    onChange={(event) => setEmail(event.target.value.slice(0, 254))}
                    placeholder={placeholder}
                    maxLength={254}
                    required
                />
                <button type="submit">{buttonLabel}</button>
            </form>
            {message && <p className="newsletter-success">{message}</p>}
        </>
    );
}

export default NewsletterSignup;
