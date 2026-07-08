// AIResearchGuideDE — /?page=ai-research-guide-de   CSS prefix: ait-
// German translation of the AI research guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, ResearchGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Darf ich ein KI-Tool als Quelle zitieren?", a: "In der Regel nein. KI-Ausgaben sind keine Primärquelle und können falsch sein. Nutzen Sie die KI, um Ideen zu finden und zu verstehen, und zitieren Sie dann die originalen, überprüfbaren Quellen, die Sie selbst bestätigt haben." },
    { q: "Warum hat die KI eine Studie oder einen Link erfunden?", a: "Sprachmodelle können „halluzinieren“ – überzeugend klingenden Text erzeugen, der nicht stimmt, einschließlich erfundener Quellen und URLs. Öffnen und prüfen Sie jede Quelle, bevor Sie sich darauf verlassen." },
    { q: "Gilt der Einsatz von KI in der Recherche als Betrug?", a: "Das hängt von den Regeln Ihrer Schule oder Ihres Arbeitsplatzes ab. KI zum Erklären von Konzepten oder zum Ordnen Ihrer Gedanken zu nutzen ist oft in Ordnung; von der KI geschriebene Texte als eigene auszugeben möglicherweise nicht. Prüfen Sie die Richtlinie und seien Sie transparent." },
    { q: "Worin ist die KI in der Recherche wirklich gut?", a: "Konzepte in einfacher Sprache erklären, Suchbegriffe und Blickwinkel vorschlagen, gliedern und Texte zusammenfassen, die Sie bereitstellen. Bei Fakten, Zahlen und Quellenangaben ist sie am schwächsten – diese müssen Sie überprüfen." },
];

export default function AIResearchGuideDE() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Anleitung: KI für die Recherche nutzen | CinNova"
                description="Lernen Sie, KI für die Recherche zu nutzen: Gliederungen, Zusammenfassungen, Quellensuche und Lernhilfe – Halluzinationen vermeiden und Fakten sorgfältig prüfen. Schritt-für-Schritt-Anleitung für Anfänger."
                pageKey="ai-research-guide-de"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/?page=ai-tutorials">← KI-Tutorials</a>
                <p className="eyebrow">KI FÜR RECHERCHE · ANFÄNGER</p>
                <h1>KI für die Recherche nutzen: Schritt-für-Schritt-Anleitung für Anfänger</h1>
                <p className="ait-guide-intro">
                    KI kann die Recherche beschleunigen – sie hilft Ihnen, ein Thema zu verstehen,
                    Blickwinkel zu finden und Notizen zu ordnen. Sie kann aber auch Fakten und falsche
                    Quellen erfinden. Diese Anleitung zeigt, wie Sie Tempo gewinnen, ohne Risiken einzugehen.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Anfänger</span>
                    <span className="ait-chip ait-chip--muted">9 Min. Lesezeit</span>
                    <span className="ait-chip ait-chip--muted">Zeitlose Anleitung</span>
                </div>
            </section>

            <ResearchGuideLangNav current="de" />

            <p className="section ait-starter-note">
                Diese übersetzte Anleitung ist Teil von CinNovas mehrsprachiger Einsteiger-Bibliothek.
                Weitere übersetzte Tutorials folgen bald.
            </p>

            <section className="section ait-guide-body">
                <h2>Was „KI-Hilfe bei der Recherche“ wirklich bedeutet</h2>
                <p>
                    KI für die Recherche zu nutzen heißt nicht, sie nach der Antwort zu fragen und diese
                    abzuschreiben. Es heißt, die KI als schnellen, unermüdlichen Assistenten einzusetzen, der
                    Ideen erklärt, Richtungen vorschlägt und Informationen ordnet – während Sie beurteilen,
                    was wahr ist.
                </p>

                <h2>Worin die KI gut ist</h2>
                <ul className="ait-list">
                    <li>Unbekannte Konzepte in einfacher Sprache erklären.</li>
                    <li>Suchbegriffe, Unterthemen und Blickwinkel vorschlagen, an die Sie nicht gedacht hatten.</li>
                    <li>Eine Arbeit, einen Bericht oder einen Lernplan gliedern.</li>
                    <li>Lange Texte zusammenfassen, die <em>Sie</em> bereitstellen.</li>
                    <li>Ihre groben Notizen in eine klare Struktur bringen.</li>
                </ul>

                <h2>Wofür die KI nicht zuverlässig ist</h2>
                <Callout tone="warn" title="Mit Vorsicht behandeln – immer überprüfen">
                    <ul className="ait-list">
                        <li>Konkrete Fakten, Daten, Statistiken und Zitate.</li>
                        <li>Quellenangaben, Studiennamen und URLs – diese sind oft erfunden.</li>
                        <li>Aktuelle Ereignisse, wenn das Tool nicht mit aktuellen Daten trainiert oder verbunden ist.</li>
                        <li>Alles mit hohem Risiko: medizinische, rechtliche, finanzielle oder sicherheitsrelevante Entscheidungen.</li>
                    </ul>
                </Callout>

                <h2>Schritt für Schritt</h2>
                <div className="ait-steps">
                    <Step n={1} title="Definieren Sie Ihre Forschungsfrage">
                        <p>Eine fokussierte Frage lenkt alles. Grenzen Sie „Klimawandel“ auf etwas Beantwortbares ein.</p>
                        <PromptExample label="Beispiel">Hilf mir, das zu einer einzigen fokussierten Forschungsfrage zu schärfen: „Wie sich Homeoffice auf die Wirtschaft von Kleinstädten auswirkt.“</PromptExample>
                    </Step>
                    <Step n={2} title="Bitten Sie um eine Hintergrunderklärung">
                        <p>Verschaffen Sie sich einen Überblick, bevor Sie einsteigen. Bitten Sie um eine einfache Übersicht und die wichtigsten Denkrichtungen.</p>
                        <PromptExample label="Beispiel">Erkläre die Grundlagen von [Thema] für Einsteiger und nenne die wichtigsten Sichtweisen oder Debatten.</PromptExample>
                    </Step>
                    <Step n={3} title="Bitten Sie um die wichtigsten Begriffe">
                        <p>Besseres Vokabular bedeutet besseres Suchen. Lassen Sie die KI die Begriffe, Namen und Konzepte auflisten, die Fachleute verwenden.</p>
                        <PromptExample label="Beispiel">Liste 10 zentrale Begriffe und 5 bekannte Forscher oder Organisationen zu [Thema] auf, damit ich danach suchen kann.</PromptExample>
                    </Step>
                    <Step n={4} title="Bitten Sie um eine Recherche-Gliederung">
                        <p>Verwandeln Sie das Thema in eine Struktur, die Sie mit geprüften Quellen füllen können.</p>
                        <PromptExample label="Beispiel">Erstelle eine Gliederung für einen 5-seitigen Bericht über [Frage], mit Abschnitten und je 2–3 Unterpunkten.</PromptExample>
                    </Step>
                    <Step n={5} title="Bitten Sie um Quellenvorschläge (und prüfen Sie dann)">
                        <p>Fragen Sie, welche <em>Arten</em> von Quellen Sie suchen sollten und wo – nicht nach exakten Angaben, denen Sie blind vertrauen.</p>
                        <PromptExample label="Beispiel">Welche Arten von Quellen (Fachzeitschriften, Behörden, Datensätze) wären für [Thema] glaubwürdig, und welche Suchbegriffe sollte ich verwenden, um sie zu finden?</PromptExample>
                    </Step>
                    <Step n={6} title="Prüfen Sie Fakten mit vertrauenswürdigen Quellen">
                        <p>Das ist der wichtigste Schritt. Öffnen Sie die Primärquellen selbst, bestätigen Sie jede Aussage und verwerfen Sie, was Sie nicht überprüfen können.</p>
                        <Callout tone="bad" title="Tun Sie das niemals">
                            <p>Übernehmen Sie keine von der KI gelieferte Statistik, kein Zitat und keine Quellenangabe in Ihre Arbeit, ohne sie in der Originalquelle zu bestätigen. Wenn Sie die Quelle nicht finden, verwenden Sie die Aussage nicht.</p>
                        </Callout>
                    </Step>
                    <Step n={7} title="Verwandeln Sie Notizen in eine Zusammenfassung">
                        <p>Fügen Sie Ihre eigenen geprüften Notizen ein und lassen Sie die KI sie ordnen – nicht neue Fakten hinzufügen.</p>
                        <PromptExample label="Beispiel">Fasse die folgenden Notizen zu einem klaren Absatz zusammen. Verwende nur, was ich liefere; füge keine Fakten hinzu. Notizen: [einfügen].</PromptExample>
                    </Step>
                    <Step n={8} title="Erstellen Sie Quellenangaben von Hand und sorgfältig">
                        <p>Erstellen Sie die Angaben aus den echten Quellen, die Sie geöffnet haben, gemäß Ihrem Zitierstil. Prüfen Sie Autor, Titel, Datum und Link von Hand – KI-generierte Quellenangaben sind häufig falsch.</p>
                    </Step>
                </div>

                <h2>Beispiel-Prompts</h2>
                <PromptExample label="Verstehen">Erkläre mir [Konzept], als wäre ich neu im Fachgebiet, und gib dann ein Beispiel aus der Praxis.</PromptExample>
                <PromptExample label="Ordnen">Hier sind meine geprüften Notizen. Gruppiere sie nach Themen und markiere alles, was widersprüchlich wirkt: [einfügen].</PromptExample>

                <h2>Fehler, die Sie vermeiden sollten</h2>
                <ul className="ait-list">
                    <li>KI-Antworten als Fakten behandeln statt als zu prüfende Hinweise.</li>
                    <li>KI-generierte Quellenangaben kopieren, ohne die Quellen zu öffnen.</li>
                    <li>Eine breite Frage stellen, statt das Thema zuerst einzugrenzen.</li>
                    <li>Die KI Material „zusammenfassen“ lassen, das Sie nie gelesen haben.</li>
                </ul>

                <h2>Eine Warnung zu Halluzinationen</h2>
                <Callout tone="warn" title="Selbstsicher ≠ korrekt">
                    <p>KI-Tools können flüssigen, autoritativ klingenden Text erzeugen, der schlicht falsch ist, einschließlich erfundener Studien, Statistiken und Weblinks. Die Lösung ist immer dieselbe: Prüfen Sie jeden Fakt und jede Quelle an einem vertrauenswürdigen, originalen Ort, bevor Sie sie verwenden.</p>
                </Callout>

                <h2>Datenschutz und akademische Ehrlichkeit</h2>
                <Callout tone="warn" title="Hinweis zu Datenschutz und Sicherheit">
                    <ul className="ait-list">
                        <li>Fügen Sie keine privaten Daten, Passwörter, API-Schlüssel oder vertraulichen Dateien in KI-Tools ein.</li>
                        <li>Oberflächen ändern sich häufig: Prüfen Sie stets die neuesten offiziellen Einstellungen und Bedingungen.</li>
                        <li>Überprüfen Sie jedes Ergebnis, bevor Sie ihm vertrauen, es veröffentlichen oder danach handeln.</li>
                        <li>Verifizieren Sie wichtige Informationen bei einer vertrauenswürdigen Quelle.</li>
                    </ul>
                </Callout>
                <Callout tone="info" title="Seien Sie ehrlich über Ihren KI-Einsatz">
                    <p>Befolgen Sie die Richtlinie Ihrer Schule oder Ihres Arbeitsplatzes zur KI. KI zum Verstehen und Ordnen zu nutzen ist meist in Ordnung; von der KI geschriebene Texte als eigene auszugeben möglicherweise nicht. Geben Sie im Zweifel an, wie Sie sie verwendet haben.</p>
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
                        <a className="ait-link-btn" href="/?page=ai-research-guide">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
