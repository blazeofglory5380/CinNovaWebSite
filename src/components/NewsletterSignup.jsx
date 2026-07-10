import { useState } from "react";
import { isValidEmail, normalizeEmailInput } from "../utils/security.js";
import { useToast } from "../ui/index.js";

function NewsletterSignup({
    onSubscribe,
    source = "Website",
    tags = [],
    placeholder = "Enter your email address",
    buttonLabel = "Subscribe",
}) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const { showToast } = useToast();

    function handleSubmit(event) {
        event.preventDefault();
        const normalizedEmail = normalizeEmailInput(email);
        if (!isValidEmail(normalizedEmail)) {
            setMessage("Please enter a valid email address.");
            showToast("Please enter a valid email address.", { variant: "error" });
            return;
        }
        const result = onSubscribe({ email: normalizedEmail, source, tags });

        const nextMessage =
            result?.status === "existing"
                ? "You're already on the Cin Nova newsletter list."
                : "Success. You're subscribed to the Cin Nova newsletter.";
        setMessage(nextMessage);
        showToast(nextMessage, { variant: "success" });
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
                <button type="submit" className="hover-lift glow-button">{buttonLabel}</button>
            </form>
            <p className="form-privacy-note">
                By subscribing, you agree to our{" "}
                <a className="form-privacy-link" href="/?page=privacy">Privacy Policy</a>.
            </p>
            {message && (
                <p className="newsletter-success" role="status">
                    {message}
                </p>
            )}
        </>
    );
}

export default NewsletterSignup;
