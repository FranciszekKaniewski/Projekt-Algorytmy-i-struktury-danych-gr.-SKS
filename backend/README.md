# PROJEKT ALGORYTMY
### SPIS TRESCI
1. [Opis projektu](#opis-projektu) 
2. [Wstęp](#wstęp)
3. [Zastosowane Algorytmy](#zastosowane-algorytmy) 
4. [Testy](#testy)
5. [Wnioski](#wnioski)
6. [Podsumowanie](#podsumowanie)
7. [How to run](#how-to-run)

## opis projektu

**Członkowie grupy:** Franciszek Kaniewski, Jarema Szyński, Kacper Smolarczyk

**Język programowania:** C++

**Uniwersytet Mikołaja Kopernika w Toruniu - wydział matematyki i informatyki**

## wstęp

**Cel projektu:** Zaprojektowanie i zaimplementowanie algorytmu umożliwiającego maksymalizację ilości piwa dostarczanego do karczm w Shire przy uwzględnieniu ograniczeń transportowych i kosztów.

**Zakres problemu:** Reprezentacja infrastruktury kraju (pola, browary, karczmy, drogi), przetwarzanie informacji przestrzennych, obliczanie przepustowości i kosztów napraw.

## zastosowane algorytmy

- ### **Max Flow** – zdefiniowane węzły i połączenia sieciowe.

`MaxFlowSolver` to klasa odpowiedzialna za obliczenie maksymalnego przepływu w sieci przepływu z ograniczonymi przepustowościami. Struktura systemu obejmuje specjalne wierzchołki pomocnicze dla etapów produkcji jęczmienia i dystrybucji piwa.

```MaxFlowSolver(std::vector<Vertex*>& vertices, std::vector<Edge*>& edges);```

**Parametry:**

`vertices` – lista wierzchołków (`Field`, `Cross`, `Brewery`, `Inn`).

`edges` – lista krawędzi między wierzchołkami.

**Działanie:**

Tworzy graf z dodatkowymi wierzchołkami: `source` (źródło jęczmienia), `barleySink` (tymczasowy zbiornik browarów), `sink` (ujście piwa).

Dla każdego typu wierzchołka:

`Field`: łączy z `source` z limitem odpowiadającym produkcji.

`Cross`: ogranicza przepustowości na sąsiednich krawędziach (limit).

`Brewery`: łączy z `barleySink`.

`Inn`: łączy z `sink`.


```bool bfs(std::vector<float>& parent)```

Wyszukuje ścieżkę powiększającą (algorytm BFS) w aktualnym stanie przepływu.

**Zwraca:**

-`true`, jeśli istnieje możliwa do użycia ścieżka.

-`false`, jeśli nie ma już możliwości zwiększenia przepływu.

```float maxFlow(std::vector<tuple<int,int,float>>& used_edges, std::vector<Vertex*> vertices)```

Oblicza maksymalny możliwy przepływ od źródła do ujścia.

**Parametry:**

`used_edges` – krawędzie wykorzystane w przepływie, zapisywane jako (`start`, `end`, `flow`).

`vertices` – lista wierzchołków, potrzebna do aktualizacji magazynów (`Brewery`).

 **Działanie:**

1. Inicjalizuje przepływy jako 0.

2. Szuka ścieżek powiększających za pomocą `bfs`.

3. W każdej iteracji:

   - Oblicza minimalny przepływ możliwy na ścieżce (`path_flow`).
   - Aktualizuje przepływy w macierzy `flowPassed`.
   - Dodaje wykorzystane krawędzie do `used_edges`.
   - Aktualizuje stan `Brewery`:
     - Etap 1: zwiększa `storage`.
     - Etap 2: zeruje `storage`.


----------------------------------------------------------------------------------------------------------------------------------
- ### **Min Cost Max Flow** – uwzględnienie kosztów transportu i przepustowości.
-----------------------------------------------------------------------------------------------------------------------------------
- ### **MapQuadrants** - Ćwiartki mapy

Opis:

Kod służy do przypisywania wartości produkcji polom na podstawie ich położenia względem zdefiniowanych obszarów (ćwiartek). Każda ćwiartka to wielokąt określony przez punkty (Point), któremu przypisana jest konkretna wartość produkcji.

Klasa `MapQuadrants` zarządza wszystkimi ćwiartkami oraz analizuje, do której z nich należy każde pole. Jeśli pole znajduje się wewnątrz jakiegoś obszaru, jego produkcja zostaje ustawiona zgodnie z przypisaną wartością ćwiartki.

Do sprawdzania, czy punkt leży wewnątrz wielokąta, używany jest algorytm oparty na znaku iloczynów wektorowych – działa poprawnie także wtedy, gdy punkt leży dokładnie na krawędzi.

Użyte Struktury:

`struct Point` - reprezentuje dwuwymiarowy punkt.

⦁ `float x` - Współrzędna X punktu

⦁ `float y` - Współrzędna Y punktu

Użyte Klasy:

`class Quadrant` - Reprezentuje jeden z obszarów (wielokątów), które mogą przypisywać produkcję do pól (Field).

⦁ `vector<Point> points` - Wierzchołki wielokąta definiujące granice ćwiartki.

⦁ `float assignedProduction` - Wartość produkcji przypisana polom znajdującym się w tym obszarze (domyślnie ustawiana na -1).

Metody Klasy Quadrant:

⦁ `Quadrant(const vector<Point>& numbers, float production)` - Konstruktor przypisujący punkty i wartość produkcji.

- `const vector<Point>& numbers` - lista wszystkich wierzchołków

- `float production` - określona wartośc produkcji dla danej ćwiartki.
  
⦁ `bool isInside(Field* f)`

- `Field* f` – wskaźnik do obiektu Field.
  
⦁ Opis funkcji:
  
-Jej działanie opiera się na własnościach iloczynu wektorowego, zadanego wzorem - `(b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x);`

-Po obliczeniu iloczynu wektorowego, sprawdzamy jego wartość. Gdy jest ona większa od 0, oznacza to, że leży on po lewej stronie krawędzi AB, natomiast jeżeli jest mniejsza od 0 to po prawej stronie. Gdy wartość jest równa 0, to punkt P leży na tej krawędzi.

Zwraca:

-Dla każdego punktu zwraca odpowiednią wartość `true` lub `false`, zależną od przynależności do wielokąta.
  
`class MapQuadrants` - Zarządza zestawem obszarów (ćwiartek), przypisuje wartości produkcji polom (Field) na podstawie ich położenia.

⦁ `vector<Quadrant*> quadrants` - Lista zdefiniowanych ćwiartek

⦁ `MapQuadrants(){}` - Domyślny konstruktor.

⦁ `MapQuadrants(vector<Vertex*> allVertices, vector<pair<vector<Point>, float>> points)`

- `vector<Vertex*> allVertices` - lista wszystkich wierzchołków (pól, browarów, zajazdów, skrzyżowań)
  
- `vector<pair<vector<Point>, float>> points` - lista par (wielokąt, produkcja), gdzie każda para definiuje jedną ćwiartkę
  
⦁ Opis funkcji:
  
Tworzy ćwiartki na podstawie przekazanych punktów i przypisuje wartości produkcji polom (Field), które znajdują się wewnątrz danej ćwiartki. Używa `dynamic_cast` do identyfikacji obiektów typu Field.

⦁ Zwraca:
  
Wypisuje informacje na temat przypisania danego pola do ćwiartki.

⦁ `int getQuadrantOfField(Field* f)` 

- `Field* f` – wskaźnik do obiektu Field.

⦁ Opis funkcji:
  
Sprawdza kolejno, do której ćwiartki należy pole f, używając metody `isInside()`.

⦁ Zwraca:
  
Indeks pierwszej pasującej ćwiartki lub -1.

Uwagi:

⦁ Obiekty klasy `Quadrant` są tworzone dynamicznie (new) w konstruktorze `MapQuadrants`, ale nie są usuwane – potencjalny wyciek pamięci.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  
- ### **Algorytm Wyszukiwania w tekscie KMP (Knutha-Morrisa-Pratta)**

Efektywny algorytm wyszukiwania wzorca w tekście, który działa w czasie liniowym względem długości tekstu i wzorca. Jego główną zaletą jest to, że unika ponownego porównywania znaków, które już zostały dopasowane.

Klasa `KMPSolver` implementuje algorytm Knutha-Morrisa-Pratta (KMP) służący do wyszukiwania wzorca w wieloliniowym tekście. Obsługuje teksty zawierające polskie znaki dzięki konwersji `UTF-8` na `wstring`

```KMPSolver(const string& tekst_utf8, const string& patern_utf8);```

Tworzy instancję klasy `KMPSolver`, konwertując wejściowe łańcuchy znaków z `UTF-8` (`string`) na `wstring`.

Metody publiczne: 
Wyszukuje wszystkie wystąpienia wzorca w każdej linii tekstu. Dla każdego dopasowania tworzy strukturę `KMPAns` z informacjami o lokalizacji.

Zwraca: 
Wektor struktur `KMPAns`, zawierających dane o wszystkich dopasowaniach wzorca.

Metody prywatne: 

```vector<int> kmpPrefixTable(const wstring& pattern);```

Opis: 
Tworzy tablicę prefiksową dla danego wzorca, wykorzystywaną w algorytmie KMP 
do optymalizacji przeskoków.

Zwraca: 
Wektor `prefix`, gdzie `prefix[i]` to długość najdłuższego prefiksu będącego jednocześnie sufiksem podciągu `pattern[0..i]`.

```vector<int> kmpSearch(const wstring& line, const wstring& pattern);```

Opis: 
Wyszukuje wszystkie wystąpienia wzorca w jednej linii tekstu, wykorzystując tablicę prefiksową.

Zwraca: 
Wektor indeksów pozycji początkowych dopasowań wzorca w danej linii.

UWAGI:

⦁	Klasa przystosowana jest do tekstów z polskimi literami (`UTF-8`).

⦁	Indeksy kolumn (column w `KMPAns`) podawane są w liczbie znaków (nie bajtów).

⦁	Działa na każdej linii osobno – nie wykrywa dopasowań "przez granice wierszy"

Złożoność O(n+m)

n - długość tekstu 

m - długość wzorca

## testy

**MaxFlow**
```bash
I 100 200
F 200 200 3.3
C 300 200 4.26
B 400 200

E 0 1
E 1 2
E 2 3
```
**MaxFlowWithCosts**
```bash
F 100 100 10
C 200 100 5
B 300 100

E 0 1
E 1 2

BarleyPath 0 1 5
BarleyPath 1 2 5

END
```

**Web build test**
```bash
F 100 100 10
C 200 100 5
B 300 100

E 0 1
E 1 2

Source: 3
BarleySink: 4
Sink: 5
isBeerReady: 0

Capacity 0 = 0 5 0 0 0 0
Capacity 1 = 5 0 5 0 0 0
Capacity 2 = 0 5 0 0 INF 0
Capacity 3 = 10 0 0 0 0 0
Capacity 4 = 0 0 INF 0 0 0
Capacity 5 = 0 0 0 0 0 0

FlowPassed 0 = 0 0 0 0 0 0
FlowPassed 1 = 0 0 0 0 0 0
FlowPassed 2 = 0 0 0 0 0 0
FlowPassed 3 = 0 0 0 0 0 0
FlowPassed 4 = 0 0 0 0 0 0
FlowPassed 5 = 0 0 0 0 0 0

Adj 0 = 1 3
Adj 1 = 0 2
Adj 2 = 1 4
Adj 3 = 0
Adj 4 = 2
Adj 5 =

END
```

## wnioski

-Projekt prezentuje zrozumienie algorytmów grafowych oraz ich implementacji w praktycznych problemach.

-Dobrze zaprojektowana struktura kodu i dokumentacji ułatwia rozwój oraz testowanie.

-Docker zapewnia powtarzalność środowiska, co jest dużym ułatwieniem podczas pracy zespołowej.

## podsumowanie

W ramach projektu zrealizowano kompletny system umożliwiający modelowanie i optymalizację dostaw piwa do karczm w świecie Shire. Projekt łączy teorię grafów, algorytmy przepływu i wyszukiwania tekstu w praktycznej implementacji w języku C++. Zaimplementowano kluczowe algorytmy: Max Flow, Min Cost Max Flow, MapQuadrants oraz KMP. Dodatkowo przygotowano zestaw testów weryfikujących poprawność implementacji oraz uruchamianie całego środowiska za pomocą Docker Compose, co pozwala łatwo testować i rozwijać aplikację.

## how to run
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
