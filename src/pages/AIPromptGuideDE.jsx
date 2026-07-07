// AIPromptGuideDE — /?page=ai-prompt-writing-guide-de   CSS prefix: ait-
// German translation of the AI prompt writing guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, PromptGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Brauche ich ein kostenpflichtiges KI-Tool zum Üben?", a: "Nein. Dieselben Prompt-Fähigkeiten funktionieren bei den meisten Assistenten. Beginnen Sie mit einem Tool, auf das Sie bereits Zugriff haben, und konzentrieren Sie sich auf klarere Anweisungen." },
    { q: "Wie lang sollte ein Prompt sein?", a: "So lang wie nötig, um Mehrdeutigkeit zu vermeiden – und nicht länger. Ein paar klare Sätze zu Rolle, Aufgabe, Kontext und Format sind meist besser als ein Ein-Wort-Prompt oder eine riesige Textwand." },
    { q: "Warum hat die KI einen Teil meines Prompts ignoriert?", a: "Lange oder widersprüchliche Prompts können dazu führen, dass das Modell Details übersieht. Teilen Sie große Anfragen in Schritte auf, stellen Sie die wichtigste Anweisung an den Anfang und lassen Sie sich die Anforderungen bestätigen." },
    { q: "Darf ich denselben Prompt wiederverwenden?", a: "Ja: Wiederverwendbare Prompt-Vorlagen sparen viel Zeit. Führen Sie eine persönliche Bibliothek und tauschen Sie jedes Mal die Details aus." },
];

export default function AIPromptGuideDE() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Bessere KI-Prompts schreiben | CinNova"
                description="Lernen Sie Schritt für Schritt, bessere KI-Prompts zu schreiben. Mit Beispielen, häufigen Fehlern, Datenschutz-Tipps und einer einfachen Prompt-Formel für Anfänger."
                pageKey="ai-prompt-writing-guide-de"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/?page=ai-tutorials">← KI-Tutorials</a>
                <p className="eyebrow">PROMPTS SCHREIBEN · ANFÄNGER</p>
                <h1>Bessere KI-Prompts schreiben: Schritt-für-Schritt-Anleitung für Anfänger</h1>
                <p className="ait-guide-intro">
                    Ein Prompt ist einfach die Anweisung, die Sie einem KI-Tool geben. Kleine Änderungen daran,
                    wie Sie fragen, können aus einer vagen, unbrauchbaren Antwort genau das machen, was Sie
                    brauchten. Diese Anleitung vermittelt eine einfache, wiederholbare Formel mit echten
                    Vorher-Nachher-Beispielen.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Anfänger</span>
                    <span className="ait-chip ait-chip--muted">8 Min. Lesezeit</span>
                    <span className="ait-chip ait-chip--muted">Zeitlose Anleitung</span>
                </div>
            </section>

            <PromptGuideLangNav current="de" />

            <p className="section ait-starter-note">
                Diese übersetzte Anleitung ist Teil von CinNovas mehrsprachiger Einsteiger-Bibliothek.
                Weitere übersetzte Tutorials folgen bald.
            </p>

            <section className="section ait-guide-body">
                <h2>Was ist ein KI-Prompt?</h2>
                <p>
                    Ein KI-Prompt ist der Text, den Sie eingeben, um einem KI-Tool mitzuteilen, was Sie
                    möchten. Das kann eine Frage, eine Aufgabe oder eine Reihe von Anweisungen sein. Die KI
                    liest Ihren Prompt und sagt eine hilfreiche Antwort voraus – je klarer und konkreter Ihr
                    Prompt, desto besser das Ergebnis.
                </p>

                <h2>Warum Prompts wichtig sind</h2>
                <p>
                    KI-Tools kennen weder Ihr Ziel noch Ihr Publikum oder Ihre Ansprüche, sofern Sie es ihnen
                    nicht sagen. Ein schwacher Prompt zwingt die KI zum Raten – und oft rät sie falsch. Ein
                    guter Prompt beseitigt das Rätselraten: Er nennt die Rolle der KI, was zu tun ist, welchen
                    Kontext sie nutzen soll, wie die Antwort formatiert sein soll und welche Grenzen gelten.
                </p>

                <h2>Die grundlegende Prompt-Formel</h2>
                <div className="ait-formula">
                    <b>Rolle</b> + <b>Aufgabe</b> + <b>Kontext</b> + <b>Format</b> + <b>Einschränkungen</b>
                </div>
                <p>
                    Sie brauchen nicht immer alle fünf, aber sie im Kopf zu behalten ist der schnellste Weg zu
                    einem Prompt, der auf Anhieb funktioniert. So wenden Sie jede einzelne an.
                </p>

                <h2>Schritt für Schritt</h2>
                <div className="ait-steps">
                    <Step n={1} title="Legen Sie die Rolle der KI fest">
                        <p>Geben Sie der KI eine Perspektive, damit sie den richtigen Ton und die richtige Fachkenntnis verwendet. „Handle als geduldiger Mathe-Tutor“ liefert ein ganz anderes Ergebnis als „handle als kritischer Gutachter“.</p>
                        <PromptExample label="Beispiel">Handle als freundlicher Karriere-Coach, der Dinge einfach erklärt.</PromptExample>
                    </Step>
                    <Step n={2} title="Erklären Sie die Aufgabe klar">
                        <p>Sagen Sie genau, was Sie möchten, mit einem starken Handlungsverb: fasse zusammen, schreibe um, vergleiche, gliedere, erstelle, kritisiere. Vermeiden Sie vage Verben wie „hilf mir bei“.</p>
                        <PromptExample label="Beispiel">Schreibe die Zusammenfassung meines Lebenslaufs so um, dass Führungsstärke und messbare Ergebnisse hervorgehoben werden.</PromptExample>
                    </Step>
                    <Step n={3} title="Fügen Sie Kontext hinzu">
                        <p>Geben Sie die Details an, die die KI nicht kennen kann: Ihr Publikum, Ihr Ziel, relevante Fakten und jegliches Material zum Arbeiten. Kontext ist meist der Unterschied zwischen generisch und nützlich.</p>
                        <PromptExample label="Beispiel">Kontext: Ich bin Krankenpfleger mit 6 Jahren Erfahrung und bewerbe mich als Stationsleitung. Hier ist meine aktuelle Zusammenfassung: [eigenen Text einfügen].</PromptExample>
                    </Step>
                    <Step n={4} title="Wählen Sie das Ausgabeformat">
                        <p>Sagen Sie der KI, wie Sie die Antwort möchten: eine Aufzählung, eine Tabelle, einen kurzen Absatz, JSON, eine E-Mail oder einen Schritt-für-Schritt-Plan. Das Format vorab festzulegen erspart Nacharbeit.</p>
                        <PromptExample label="Beispiel">Gib mir drei Versionen als kurze Absätze, jeweils unter 60 Wörtern.</PromptExample>
                    </Step>
                    <Step n={5} title="Fügen Sie Einschränkungen hinzu">
                        <p>Setzen Sie Grenzen: Länge, Ton, Leseniveau, was zu vermeiden und was einzuschließen ist. Einschränkungen halten die Antwort fokussiert.</p>
                        <PromptExample label="Beispiel">Bleibe professionell, vermeide Modewörter und erfinde keine Positionen oder Daten, die ich nicht angegeben habe.</PromptExample>
                    </Step>
                    <Step n={6} title="Bitten Sie um Überarbeitungen">
                        <p>Die erste Antwort ist ein Entwurf. Verbessern Sie sie mit gezielten Nachfragen, statt von vorn zu beginnen. Zeigen Sie genau auf den Teil, den Sie ändern möchten.</p>
                        <PromptExample label="Beispiel">Version 2 kommt am nächsten. Kürze sie um 20 % und beginne mit dem stärksten Ergebnis.</PromptExample>
                    </Step>
                    <Step n={7} title="Speichern Sie wiederverwendbare Prompts">
                        <p>Wenn ein Prompt gut funktioniert, speichern Sie ihn als Vorlage mit Platzhaltern. Beim nächsten Mal tauschen Sie die Details aus und nutzen die Struktur erneut.</p>
                        <PromptExample label="Vorlage">Handle als [Rolle]. [Aufgabe] für [Publikum]. Kontext: [Details]. Format: [Format]. Einschränkungen: [Grenzen].</PromptExample>
                    </Step>
                </div>

                <h2>Beispiel für einen guten Prompt</h2>
                <Callout tone="good" title="Klar, konkret und strukturiert">
                    <PromptExample>Handle als Lektor. Schreibe den folgenden Absatz für ein allgemeines Publikum auf einfachem Leseniveau um. Bleibe unter 120 Wörtern, ändere keine Fakten und gib nur den überarbeiteten Absatz zurück. Absatz: [Text einfügen].</PromptExample>
                </Callout>

                <h2>Beispiel für einen schlechten Prompt</h2>
                <Callout tone="bad" title="Vage – die KI muss raten">
                    <PromptExample>mach das besser</PromptExample>
                    <p>Keine Rolle, kein Publikum, kein Format, keine Länge und kein angehängter Text. Erwarten Sie eine generische Antwort.</p>
                </Callout>

                <h2>Vorher / nachher</h2>
                <Callout tone="bad" title="Vorher">
                    <PromptExample>schreib über den Klimawandel</PromptExample>
                </Callout>
                <Callout tone="good" title="Nachher">
                    <PromptExample>Handle als Wissenschaftskommunikator. Schreibe eine 150-Wörter-Erklärung, warum sich Städte heißer anfühlen als nahe ländliche Gebiete, für neugierige Jugendliche. Verwende eine Alltagsanalogie, vermeide Fachjargon und schließe mit einem praktischen Tipp.</PromptExample>
                </Callout>

                <h2>Häufige Anfängerfehler</h2>
                <ul className="ait-list">
                    <li>Zu vage sein – keine Rolle, kein Publikum, kein Format.</li>
                    <li>Alles in einem einzigen riesigen Prompt verlangen statt in Schritten.</li>
                    <li>Nicht den Text oder die Daten liefern, mit denen die KI arbeiten soll.</li>
                    <li>Die erste Antwort akzeptieren, ohne eine Überarbeitung zu verlangen.</li>
                    <li>Dem Ergebnis vertrauen, ohne die Fakten zu prüfen.</li>
                </ul>

                <h2>Datenschutz und Sicherheit</h2>
                <Callout tone="warn" title="Hinweis zu Datenschutz und Sicherheit">
                    <ul className="ait-list">
                        <li>Fügen Sie keine privaten Daten, Passwörter, API-Schlüssel oder vertraulichen Dateien in KI-Tools ein.</li>
                        <li>Oberflächen ändern sich häufig: Prüfen Sie stets die neuesten offiziellen Einstellungen und Bedingungen.</li>
                        <li>Überprüfen Sie jedes Ergebnis, bevor Sie ihm vertrauen, es veröffentlichen oder danach handeln.</li>
                        <li>Verifizieren Sie wichtige Informationen bei einer vertrauenswürdigen Quelle.</li>
                    </ul>
                </Callout>

                <h2>Häufige Fragen</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <section className="section">
                <div className="ait-guide-cta-card">
                    <h2>Lernen Sie weiter über KI</h2>
                    <p>Entdecken Sie weitere anfängerfreundliche, schrittweise KI-Tutorials im KI-Tutorials-Center von CinNova.</p>
                    <div className="ait-guide-cta-actions">
                        <a className="primary-btn" href="/?page=ai-tutorials">← Zurück zu den KI-Tutorials</a>
                        <a className="ait-link-btn" href="/?page=ai-prompt-writing-guide">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
