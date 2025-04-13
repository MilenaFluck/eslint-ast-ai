## Ideen für weitere Regeln

### Best Practices

- Suffix Rest-Services with -http.service.ts
- Dumb-Components dürfen keine Http-Services oder den State injecten.

### Angular

- Verbot der Verwendung privater oder protected Modifier in Komponenten und Services, um bessere Tests und eine bessere Wartbarkeit des Codes zu fördern, indem Eigenschaften und Methoden öffentlich gemacht oder Getter-Methoden verwendet werden.

### Security

- Erzwinge die Verwendung einer sicheren Zufallszahlengenerierung (crypto.getRandomValues()) anstelle von unsicheren Methoden wie Math.random() für kryptografische Zwecke oder Sitzungsmanagement.
- Verbiete die Verwendung von eval() aufgrund seines Potenzials für Sicherheitslücken. Sie ermöglicht die Ausführung von beliebigem Code, was ein Sicherheitsrisiko darstellt.

## Performance

- Verbiete die Verwendung von setTimeout innerhalb von Schleifen, da dies zu unerwarteten Verzögerungen und Leistungsproblemen führen kann.
- Vermeide Schleifen, die zu Leistungsengpässen führen können, insbesondere wenn sie große Datenmengen verarbeiten. Verwenden Sie nach Möglichkeit effizientere Algorithmen.

### Test-related

- Doppelte Testfälle mit derselben Logik oder demselben Abdeckungsbereich sind nicht zulässig. Dadurch wird sichergestellt, dass die Tests sinnvoll und nicht redundant sind.

### Code Quality

- Mehrere aufeinanderfolgende Leerzeilen sind nicht zulässig, um die Codebasis sauber und konsistent zu halten.
