# PROJEKT ALGORYTMY
### SPIS TRESCI
1. [Opis projektu](#opis-projektu) 
2. Formalizacja 3
3. Zastosowane Algorytmy 4
4. Implementacja
5. s
6. s
7. s
8. s
9. [How to run](#how-to-run)

## opis projektu
Członkowie grupy: Franciszek Kaniewski, Jerema Szyński, Kacper Smolarczyk
Język programowania: C++
Uniwersytet Mikołaja Kopernika w Toruniu - wydział matematyki i informatyki

## WSTĘP
Cel projektu: Zaprojektowanie i zaimplementowanie algorytmu umożliwiającego maksymalizację ilości piwa dostarczanego do karczm w Shire przy uwzględnieniu ograniczeń transportowych i kosztów.
Zakres problemu: Reprezentacja infrastruktury kraju (pola, browary, karczmy, drogi), przetwarzanie informacji przestrzennych, obliczanie przepustowości i kosztów napraw.

## Formalizacja
Wejscie:
Wyjscie:
Ograniczenia:
Reprezentacja:

## Zastosowane Algorytmy
⦁	Max Flow

⦁	Min Cost Max Flow

⦁ MapQuadrants - Ćwiartki mapy
Opis:
Kod służy do przypisywania wartości produkcji polom na podstawie ich położenia względem zdefiniowanych obszarów (ćwiartek). Każda ćwiartka to wielokąt określony przez punkty (Point), któremu przypisana jest konkretna wartość produkcji.

Klasa MapQuadrants zarządza wszystkimi ćwiartkami oraz analizuje, do której z nich należy każde pole. Jeśli pole znajduje się wewnątrz jakiegoś obszaru, jego produkcja zostaje ustawiona zgodnie z przypisaną wartością ćwiartki.

Do sprawdzania, czy punkt leży wewnątrz wielokąta, używany jest algorytm oparty na znaku iloczynów wektorowych – działa poprawnie także wtedy, gdy punkt leży dokładnie na krawędzi.

Użyte Struktury:
struct Point - reprezentuje dwuwymiarowy punkt.
⦁ float x - Współrzędna X punktu
⦁ float y - Współrzędna Y punktu

Użyte Klasy:
class Quadrant - Reprezentuje jeden z obszarów (wielokątów), które mogą przypisywać produkcję do pól (Field).
⦁ vector<Point> points - Wierzchołki wielokąta definiujące granice ćwiartki.
⦁ float assignedProduction - Wartość produkcji przypisana polom znajdującym się w tym obszarze (domyślnie ustawiana na -1).

Metody Klasy Quadrant:
⦁ Quadrant(const vector<Point>& numbers, float production) - Konstruktor przypisujący punkty i wartość produkcji.
- const vector<Point>& numbers - lista wszystkich wierzchołków
- float production - określona wartośc produkcji dla danej ćwiartki.
⦁ bool isInside(Field* f)
- Field* f – wskaźnik do obiektu Field.
- Opis funkcji:
  
-Jej działanie opiera się na własnościach iloczynu wektorowego, zadanego wzorem - (b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x);
-Po obliczeniu iloczynu wektorowego, sprawdzamy jego wartość. Gdy jest ona większa od 0, oznacza to, że leży on po lewej stronie krawędzi AB, natomiast jeżeli jest mniejsza od 0 to po prawej stronie. Gdy wartość jest równa 0, to punkt P leży na tej krawędzi.

Zwraca:

-Dla każdego punktu zwraca odpowiednią wartość true lub false, zależną od przynależności do wielokąta.
  
class MapQuadrants - Zarządza zestawem obszarów (ćwiartek), przypisuje wartości produkcji polom (Field) na podstawie ich położenia.
⦁ vector<Quadrant*> quadrants - Lista zdefiniowanych ćwiartek
⦁ MapQuadrants(){} - Domyślny konstruktor.
⦁ MapQuadrants(vector<Vertex*> allVertices, vector<pair<vector<Point>, float>> points)
- vector<Vertex*> allVertices - lista wszystkich wierzchołków (pól, browarów, zajazdów, skrzyżowań
- vector<pair<vector<Point>, float>> points - lista par (wielokąt, produkcja), gdzie każda para definiuje jedną ćwiartkę
- Opis funkcji:
  
Tworzy ćwiartki na podstawie przekazanych punktów i przypisuje wartości produkcji polom (Field), które znajdują się wewnątrz danej ćwiartki. Używa dynamic_cast do identyfikacji obiektów typu Field.

- Zwraca:
  
Wypisuje informacje na temat przypisania danego pola do ćwiartki.

⦁ int getQuadrantOfField(Field* f) 
- Field* f – wskaźnik do obiektu Field.

- Opis funkcji:
  
Sprawdza kolejno, do której ćwiartki należy pole f, używając metody isInside().

- Zwraca:
  
Indeks pierwszej pasującej ćwiartki lub -1.

Uwagi:

⦁ Obiekty klasy Quadrant są tworzone dynamicznie (new) w konstruktorze MapQuadrants, ale nie są usuwane – potencjalny wyciek pamięci.
  
⦁	Algorytm Wyszukiwania w tekscie(KMP)
Klasa KMPSolver implementuje algorytm Knutha-Morrisa-Pratta (KMP) służący do wyszukiwania wzorca w wieloliniowym tekście. Obsługuje teksty zawierające polskie znaki dzięki konwersji UTF-8 na wstring

```KMPSolver(const string& tekst_utf8, const string& patern_utf8);```

Tworzy instancję klasy KMPSolver, konwertując wejściowe łańcuchy znaków z UTF-8 (string) na wstring.
METODY PUBLICZNE:
Wyszukuje wszystkie wystąpienia wzorca w każdej linii tekstu. Dla każdego dopasowania tworzy strukturę KMPAns z informacjami o lokalizacji.
Zwraca:
Wektor struktur KMPAns, zawierających dane o wszystkich dopasowaniach wzorca.
METODY PRYWATNE:

```vector<int> kmpPrefixTable(const wstring& pattern);```

Opis:

Tworzy tablicę prefiksową dla danego wzorca, wykorzystywaną w algorytmie KMP 
do optymalizacji przeskoków.

Zwraca:

Wektor prefix, gdzie prefix[i] to długość najdłuższego prefiksu będącego jednocześnie sufiksem podciągu pattern[0..i].

```vector<int> kmpSearch(const wstring& line, const wstring& pattern);```

Opis:

Wyszukuje wszystkie wystąpienia wzorca w jednej linii tekstu, wykorzystując tablicę prefiksową.

Zwraca:

Wektor indeksów pozycji początkowych dopasowań wzorca w danej linii.

UWAGI:

⦁	Klasa przystosowana jest do tekstów z polskimi literami (UTF-8).

⦁	Indeksy kolumn (column w KMPAns) podawane są w liczbie znaków (nie bajtów).

⦁	Działa na każdej linii osobno – nie wykrywa dopasowań "przez granice wierszy"

## Implementacja

## Analiza złozonosci

## Prezentacja działania programu

## TESTY

## Wnioski

## Podsumowanie

## 🛠 Jak Uruchomić
1. Klonowanie repozytorium:
    ```bash
    git clone https://github.com/FranciszekKaniewski/Projekt-Algorytmy-i-struktury-danych-gr.-SKS.git
    ```
2. Przejście do katalogu projektu:
    ```bash
    cd ./Projekt-Algorytmy-i-struktury-danych-gr.-SKS
    ```
3. Budowa aplikacji:
    ```bash
    docker-compose --profile build up --build
    ```
4. Uruchamianie aplikacji:
    ```bash
    docker-compose --profile run up
    ```
5. Uruchamianie testów:
    ```bash
    docker-compose up tests-run
    ```
