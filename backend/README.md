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
