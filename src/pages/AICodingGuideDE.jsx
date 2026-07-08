// AICodingGuideDE — /?page=ai-coding-guide-de   CSS prefix: ait-
// German translation of the AI coding guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, CodingGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Muss ich programmieren können, um einen KI-Coding-Assistenten zu nutzen?", a: "Es hilft sehr. Die KI kann Code schreiben, den Sie nicht verstehen, aber Sie müssen ihn dennoch ausführen, testen und beurteilen, ob er korrekt und sicher ist. Fangen Sie klein an und lassen Sie sich jeden Teil erklären." },
    { q: "Schreibt die KI meine ganze App für mich?", a: "Sie kann große Blöcke erzeugen, aber größere Anfragen enthalten eher Fehler oder feine Ungenauigkeiten. Eine Funktion oder Datei nach der anderen zu bearbeiten hält das Ergebnis überprüfbar und leichter korrigierbar." },
    { q: "Ist KI-generierter Code immer sicher?", a: "Nein. Assistenten können Code mit Sicherheitslücken oder veralteten Praktiken erzeugen. Prüfen Sie besonders sorgfältig alles, was Authentifizierung, Zahlungen, Nutzerdaten oder das Netzwerk betrifft." },
    { q: "Kann ich der Code-Erklärung der KI vertrauen?", a: "Meist hilfreich, aber nicht garantiert. Wenn Erklärung und Code voneinander abweichen, vertrauen Sie dem, was beim Ausführen tatsächlich passiert, und prüfen Sie es anhand der offiziellen Dokumentation." },
];

export default function AICodingGuideDE() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Anleitung: KI zum Programmieren nutzen | CinNova"
                description="Lernen Sie, KI-Coding-Assistenten zu nutzen: Projekte planen, kleine Funktionen schreiben, Fehler beheben, Code erklären und sicher prüfen, bevor Sie ihn übernehmen. Schritt-für-Schritt-Anleitung für Anfänger."
                pageKey="ai-coding-guide-de"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/?page=ai-tutorials">← KI-Tutorials</a>
                <p className="eyebrow">KI ZUM PROGRAMMIEREN · ANFÄNGER</p>
                <h1>KI zum Programmieren nutzen: Schritt-für-Schritt-Anleitung für Anfänger</h1>
                <p className="ait-guide-intro">
                    KI-Coding-Assistenten können Projekte planen, Funktionen schreiben und Fehler erklären –
                    und verwandeln Stunden des Suchens in Minuten. Sie machen aber auch selbstbewusst Fehler.
                    Diese Anleitung zeigt einen sicheren, überprüfbaren Arbeitsablauf.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Anfänger</span>
                    <span className="ait-chip ait-chip--muted">9 Min. Lesezeit</span>
                    <span className="ait-chip ait-chip--muted">Zeitlose Anleitung</span>
                </div>
            </section>

            <CodingGuideLangNav current="de" />

            <p className="section ait-starter-note">
                Diese übersetzte Anleitung ist Teil von CinNovas mehrsprachiger Einsteiger-Bibliothek.
                Weitere übersetzte Tutorials folgen bald.
            </p>

            <section className="section ait-guide-body">
                <h2>Wobei KI-Coding-Assistenten helfen können</h2>
                <ul className="ait-list">
                    <li>Unbekannten Code, Fehler und Konzepte erklären.</li>
                    <li>Kleine Funktionen oder einzelne Dateien aus einer Beschreibung entwerfen.</li>
                    <li>Lösungen vorschlagen, wenn Sie eine Fehlermeldung einfügen.</li>
                    <li>Code refaktorieren, damit er klarer oder sicherer wird.</li>
                    <li>Tests und Verwendungsbeispiele schreiben.</li>
                </ul>

                <h2>Was sie nicht garantieren können</h2>
                <Callout tone="warn" title="Sie bleiben der Entwickler">
                    <ul className="ait-list">
                        <li>Dass der Code korrekt ist – er kann richtig aussehen und trotzdem falsch sein.</li>
                        <li>Dass er sicher oder auf dem Stand aktueller bewährter Praktiken ist.</li>
                        <li>Dass er zu Ihren genauen Versionen, Ihrer Umgebung oder Ihren Anforderungen passt.</li>
                        <li>Dass er nicht stillschweigend etwas anderes in Ihrem Projekt kaputt macht.</li>
                    </ul>
                </Callout>

                <h2>Schritt für Schritt</h2>
                <div className="ait-steps">
                    <Step n={1} title="Beschreiben Sie Ihr Projekt">
                        <p>Geben Sie dem Assistenten das Gesamtbild: was Sie bauen, Sprache und Werkzeuge sowie das Ziel. Kontext vorab verhindert unpassende Vorschläge.</p>
                        <PromptExample label="Beispiel">Ich baue eine einfache Webseite mit reinem HTML, CSS und JavaScript, die eine im Browser gespeicherte To-do-Liste anzeigt. Ohne Frameworks.</PromptExample>
                    </Step>
                    <Step n={2} title="Bitten Sie zuerst um einen einfachen Plan">
                        <p>Holen Sie sich vor jedem Code einen kurzen Plan. Einen Plan zu korrigieren ist einfacher, als schlechten Code zu entwirren.</p>
                        <PromptExample label="Beispiel">Gib mir einen einfachen, nummerierten Plan, um das zu bauen. Schreib noch keinen Code.</PromptExample>
                    </Step>
                    <Step n={3} title="Bitten Sie um eine Datei oder Funktion nach der anderen">
                        <p>Kleine, fokussierte Anfragen liefern Code, den Sie wirklich lesen und testen können. Bauen Sie Stück für Stück auf.</p>
                        <PromptExample label="Beispiel">Schreibe nur die Funktion, die ein To-do im lokalen Speicher ablegt. Halte sie klein und füge Kommentare hinzu.</PromptExample>
                    </Step>
                    <Step n={4} title="Lassen Sie die KI den Code erklären">
                        <p>Fügen Sie nie Code ein, den Sie nicht verstehen. Bitten Sie um eine Zeile-für-Zeile-Erklärung und was schiefgehen könnte.</p>
                        <PromptExample label="Beispiel">Erkläre diese Funktion Zeile für Zeile und liste die Randfälle auf, die sie nicht abdeckt.</PromptExample>
                    </Step>
                    <Step n={5} title="Führen Sie den Code lokal aus">
                        <p>Führen Sie ihn wirklich in Ihrer eigenen Umgebung aus. Der echte Test ist das Verhalten, nicht die Beschreibung der KI. Probieren Sie normale und ungewöhnliche Eingaben.</p>
                    </Step>
                    <Step n={6} title="Geben Sie Fehler an die KI zurück">
                        <p>Wenn etwas kaputtgeht, fügen Sie die vollständige Fehlermeldung und den relevanten Code ein. Konkrete Fehler erhalten konkrete Lösungen.</p>
                        <PromptExample label="Beispiel">Ich habe beim Ausführen diesen Fehler bekommen: [vollständigen Fehler einfügen]. Hier ist die Funktion: [einfügen]. Was ist falsch und wie behebe ich es?</PromptExample>
                    </Step>
                    <Step n={7} title="Bitten Sie um sichereren oder refaktorierten Code">
                        <p>Sobald es funktioniert, bitten Sie den Assistenten um Verbesserungen: klarere Namen, Fehlerbehandlung und sicherere Muster.</p>
                        <PromptExample label="Beispiel">Refaktoriere das für bessere Lesbarkeit, füge grundlegende Fehlerbehandlung hinzu und weise auf Sicherheitsbedenken hin.</PromptExample>
                    </Step>
                    <Step n={8} title="Prüfen Sie, bevor Sie übernehmen">
                        <p>Sie sind für das verantwortlich, was Sie veröffentlichen. Lesen Sie jede Änderung, führen Sie Ihre Tests aus und stellen Sie sicher, dass Sie sie verstehen, bevor Sie committen.</p>
                        <Callout tone="info" title="Kurze Prüf-Checkliste">
                            <ul className="ait-list">
                                <li>Verstehe ich, was dieser Code tut?</li>
                                <li>Habe ich ihn ausgeführt und Randfälle getestet?</li>
                                <li>Geht er sicher mit Geheimnissen, Nutzerdaten oder dem Netzwerk um?</li>
                                <li>Macht er etwas anderes kaputt?</li>
                            </ul>
                        </Callout>
                    </Step>
                </div>

                <h2>Beispiel-Prompts zum Programmieren</h2>
                <PromptExample label="Bauen">Schreibe eine kleine, gut kommentierte JavaScript-Funktion, die eine E-Mail-Adresse validiert. Halte sie einfach und erkläre den Ansatz.</PromptExample>
                <PromptExample label="Verstehen">Was macht dieser reguläre Ausdruck, und wo könnte er versagen? [einfügen]</PromptExample>

                <h2>Beispiel-Prompts zum Debuggen</h2>
                <PromptExample label="Debuggen">Diese Funktion sollte sortierte Zahlen zurückgeben, gibt sie aber als Zeichenketten zurück. Hier sind der Code und eine Beispiel-Ein-/Ausgabe: [einfügen]. Warum, und wie behebe ich es?</PromptExample>
                <PromptExample label="Debuggen">Meine Seite lädt, aber der Button tut nichts. Hier sind HTML und JS: [einfügen]. Führe mich durch, was ich zuerst prüfen sollte.</PromptExample>

                <h2>Anfängerfehler, die Sie vermeiden sollten</h2>
                <ul className="ait-list">
                    <li>Große Mengen KI-Code einfügen, ohne sie zu lesen oder auszuführen.</li>
                    <li>Eine ganze App in einem einzigen Prompt verlangen statt in kleinen Teilen.</li>
                    <li>Annehmen, dass der Code sicher ist oder zu Ihren Bibliotheksversionen passt.</li>
                    <li>Lokale Tests überspringen, weil „es richtig aussieht“.</li>
                    <li>Änderungen committen, die Sie nicht verstehen.</li>
                </ul>

                <h2>Sicherheitshinweis</h2>
                <Callout tone="bad" title="Fügen Sie niemals Geheimnisse ein">
                    <p>Fügen Sie keine API-Schlüssel, Passwörter, Tokens, privaten Schlüssel, Kundendaten oder proprietären Code in ein KI-Tool ein. Ersetzen Sie Geheimnisse vor dem Teilen von Code durch Platzhalter wie <code>YOUR_API_KEY</code> und erneuern Sie jedes Geheimnis, das Sie möglicherweise offengelegt haben.</p>
                </Callout>
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
                        <a className="ait-link-btn" href="/?page=ai-coding-guide">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
