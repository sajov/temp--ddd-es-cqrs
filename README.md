# CQRS, Event-Sourcing und Domain-Driven Design (DDD)

## Domain-Driven Design

- Test-Driven Design
- Model-Driven Design
- Behavior-Driven Design
- ...-Driven Design

=> Entwurf von Software, mit Fokus auf X

- Domain-Driven Design = Softwareentwurf / -entwicklung, die die Domain in den Vordergrund rückt
  - Domain? `.com`, `.net`, `.org`, … => Nicht gemeint
  - Domain = Fachbereich, Fachsprache, Fachthematik, Fachlichkeit, …

- Softwareentwicklung ist kein Selbstzweck
  - Das Ziel von Softwareentwicklung ist, fachliche Probleme aus der realen Welt zu lösen.

- Eric Evans, 2004, "Domain-Driven Design: Tackling Complexity in the Heart of Software"
  - Hilfsmittel, Werkzeuge, Leitplanken, …
  - "Blue Book"
- Vaughn Vernon, "Implementing Domain-Driven Design"
  - "Red Book"

### Zwei Aspekte

- Kunde (fachlich: was) <-> Entwickler (technisch: wie)
  - Weitere Rollen: Designer, Marketing, Sales, Tester, …
  - Interdisziplinäres Teams

- Unterschiedliche Begriffs / unterschiedliche Interpretationen
  - regelmäßig: stetig wiederkehrend (Alltag), gemäß einer Regel (Jura)
  - Reichweite: Kilometerzahl (Automobil), Follower (Social-Media)
  - …

=> Missverständnisse

- "Language Gap"
  - Neugier, Interesse, Empathie, Reflektion => untechnisch
  - Ziel: Gemeinsames Verständnis, gemeinsame Sprache
  - => Menschliche, fachliche Ansatz

- Patterns, Artefakten, Prinzipien, Bausteinen, …
  - Entity, Value Object, Aggregate, Aggregate Root, Shared Kernel, Bounded Context, Subdomain, Core-Domain, Supporting Domains, Anti-Corruption Layer, Domain, Repository, Factory, …
  - => Technische Ansatz

- Singleton = Einzelstück
  - Idee: Klasse, von der nur genau eine einzige Instanz existiert
  - Beispielcode

```csharp
public class MyValue
{
  private MyValue _instance;

  private string value;

  private MyValue ()
  {
    this.value = '';
  }

  public static MyValue getInstance ()
  {
    if (this._instance == null)
    {
      this._instance = new MyValue();
    }

    return this._instance;
  }
}
```

### Wie kommt man zu einer gemeinsamen Sprache?

- Raus aus der Komfortzone
  - Begriffe suchen, die einen Sachverhalt passend und treffend beschreiben
  - In 99,9% der Fälle *NICHT* Create, Update oder Delete

- Wie nennt man den Vorgang im Schach, eine Figur zu bewegen?
  - Move piece
  - Move figure
  - Make move

- Fachsprachen
  - Vorgegeben: Rechtliche Gründe, Regelwerk, Fachbereich, …
  - Selbst finden: Never completed game, …

#### Command

- Anwender haben Intentionen, Ziele, Absichten, …
  - Nicht technisch, sondern fachlich!
- Befehl (Wunsch) => Befehlsform, Imperativ
  - Verb (Imperativ) + Substantiv

##### TodoMVC

- Aufgabe löschen
- Aufgabe hinzufügen
- Aufgabe bearbeiten
- Aufgabe als erledigt markieren
- Aufgabe filtern
- Zeige nur aktive oder nicht-abgeschlossene oder abgeschlossene an
- Lösche alle fertigen
- Lösche alle abgeschlossenen
- Lösche eine Aufgabe
- Aktualisiere eine Aufgabe

- Add todo to list => speichern => merken / nicht vergessen / erinnern
- Create todo at list
- Remind me for todo => impliziert Erinnerung, die mich proaktiv benachrichtigt
- Memorize => sich merken => eher bei sich selbst verortet
- Note todo => notieren => wie auf einem Post-It
- Create reminder / not todo ;-)

- Delete todo
- Remove todo from list
- Edit todo
- Modify todo
- Update todo
- Mark todo as completed
- Mark todo as finished
- Check it
- Set todo as completed
- Did todo
- Mark todo as done
- Strike through todo
- Check off todo
- Cross out todo
- Tick off todo
- ...

=> CRUD, unterschiedliche Wörter für (gleiche?) Bedeutung

- Gleiche Wörter für unterschiedliche Konstrukte
- Unterschiedliche Wörter für identische Konstrukte

- Vorschlag
  - note todo
  - edit todo
  - mark todo as done
  - revert mark todo as done
  - drop todo

- Commands können ausgeführt oder abgelehnt werden
- Commands folgen gewissen Regeln

#### Domain-events

- Beschreibt einen historischen und stattgefundenen Fakt
  - Kann nicht rückgängig gemacht werden
  - Effekt kann kompensiert werden
- Ereignis => Vergangenheitsform
  - Substantiv + Verb (Vergangenheitsform)

- note todo => todo noted
- edit todo => todo edited
- mark todo as done => todo marked as done
- revert mark todo as done => mark todo as done reverted
- drop todo => todo dropped

- Command - Domain-Event = Request - Response = Aktion = Reaktion
- Verhältnis
  - 1 Command => 1 Domain-Event
  - 1 Command => n Domain-Events
  - m Commands => 1 Domain-Event
  - m Commands => n Domain-Events

- Beispiel für m:n
  - Start group => Group started + Group joined
  - Join group => Group joined
  - Switch group => Group left + Group joined
  - Leave group => Group left

#### Commands und Domain-Events: State

- Struktur
  - name ("Note todo")
  - data (welches Todo)
  - metadata (Zeitpunkt, ID)

- Logik, die Commands verarbeitet
  - Greift auf Parameter (data, metadata) von Command zu
  - State / Zustand => Überdauert einzelne Commands, existiert unabhängig

Commands => State => Domain-Events

- Anforderungen an State
  - Konsistenz, Integrität
- Anforderungen an Commands
  - Atomar
  - Konsistent
  - Isoliert
  - Dauerhaft
  - => ACID-Kriterien, wie bei Transaktionen in SQL

```
+----------------------------+
|         State              |  Transaktionsgrenze
|        /     \             |  = Aggregate
|       /       \            |  = Hülle, innerhalb der Konsistenz geschützt wird
| Commands     Domain-Events |
+----------------------------+
```

- Wie groß sind denn Aggregates?
  - Größere Aggregates: Konsistenz für große Bereiche gegeben, Nebenläufigkeit leidet
  - Kleine Aggregates: Hervorragende Nebenläufigkeit, Konsistenz für kleine Bereiche gewährleisten

=> Aggregates sollten so groß wie nötig sein, aber so klein wie möglich.

#### Sprache in DDD

- Ziel: Gemeinsames Verständnis, gemeinsame Sprache

- Was nicht gemeint ist
  - Universal language
  - Global eineindeutig
- Was gewünscht ist
  - Eindeutige Sprache in einem gewissen Bereich / Kontext

- Bounded Context
  - Bounded = eingegrenzt, weil dieser Kontext/Bereich eine Sprachgrenze darstellt
  - Sprache innerhalb eines solchen Kontexts nennt man "Ubiquitous Language"

- Domain
  - TodoMVC
  - Bounded Context
    - organizing
    - Aggregate
      - todo list
      - State
        - todos
      - Commands / Domain-Events
        - note todo / todo noted
        - edit todo / todo edited
        - …

## Event-Sourcing

[…]
