# Lehrerbingo
Die Meteor implementation von dem Gewinnerprojekt der HPI CodeNight 2015 von Nina Ihde, Bianca Mey, Wencke Bohlius, Pascal Schulze, Anton Lydike und Till.
## Spielregeln
Beim Lehrerbingo geht es darum, vier zufällg ausgewählte Wörter im Unterricht im Gespräch mit dem Lehrer zu erwähnen, ohne dass es allzu unnatürlich herüber kommt. Gewonnen hat der Spieler, der zuerst seine 4 Wörter sagen kann.
## Aktuelle Version live
Die aktuellste stabel version ist unter http://lehrerbingo.meteor.com/ gehostet.
## Geplante Features
* Verschieden Wortgruppen für abwechslungsreichere Spiele
* Bestätigen von wörtern von anderen Spielern (Um Betrug vor zu beugen)
 

## Bekannte Probleme
Momentan, muss manuell bei jedem Reset des Projektes die Wörterdatenbank "manuell" aufgefüllt werden. dafür muss die Methode `Meteor.call('reset');` vom user `anton` aufgerufen werden. Dies setzt die Wörterdatenbank und alle aktuellen Lobbys zurück.
