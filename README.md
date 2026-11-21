# [Terminy leczenia NFZ](https://terminy-leczenia-nfz.pl)

Wyszukiwarka terminów leczenia w ramach NFZ. Pozwala przeszukiwać dane o dostępnych terminach wizyt i zabiegów w placówkach medycznych w całej Polsce.

## Google Analytics 4

Integracja z usługą `G-VR4S69HXNZ` uruchamia się po zgodzie użytkownika.
Przed wdrożeniem administrator musi:

1. W GA4 wyłączyć **Pomiar zaawansowany** dla strumienia danych, w tym
	automatyczne wyszukiwanie w witrynie, kliknięcia wychodzące, interakcje z
	formularzami i odsłony przy zmianach historii. Automatyczne zdarzenia mogą
	ujawnić świadczenie lub inne filtry z linków i tytułów; sam kod strony nie
	kontroluje ustawień strumienia GA4. Sprawdzić również konfigurację tagu,
	połączone usługi i inne automatyczne zbieranie danych.
2. Sprawdzić zakres danych, warunki Google, transfery, okres przechowywania i
	wymogi dotyczące zgody oraz zaktualizować politykę prywatności odpowiednio do
	faktycznej konfiguracji. Ocenić rozwiązanie z osobą odpowiedzialną za RODO.
3. Sprawdzić w narzędziach deweloperskich żądania sieciowe oraz GA4 DebugView:
	przed zgodą i po odmowie żądania do GA nie powinny występować. Po akceptacji
	sprawdzić również wyszukiwanie, linki udostępnione, nawigację, wycofanie
	zgody i kliknięcia w wyniki. Parametry zdarzenia `search` powinny odpowiadać
	wybranym wartościom formularza. Pełne adresy wyszukiwania nie są wysyłane
	przez kod analityki strony; należy też sprawdzić ustawienia automatycznego
	zbierania danych w GA4.

Skrypt Google ładowany jest wyłącznie po akceptacji analityki. Dostępne są
przycisk odmowy oraz możliwość zmiany wyboru w stopce. Zdarzenie `search` zawiera:

- `search_term` — nazwę świadczenia;
- `search_provinces` — wybrane województwa, uporządkowane alfabetycznie;
- `search_city` — miejscowość, gdy jest wybrana;
- `search_provider` — placówkę, gdy jest wybrana;
- `search_children` — `yes` lub `no` zależnie od opcji dla dzieci.

Do GA trafiają wartości z katalogów, nie dowolny tekst wpisany lub przekazany w
adresie URL. Każdy parametr tekstowy ma limit 100 znaków; dłuższe wartości są
dzielone na maksymalnie trzy kolejne parametry, np. `search_provider`,
`search_provider_2`, `search_provider_3` (łącznie do 300 znaków). W aktualnym
katalogu limit ten obejmuje wszystkie nazwy. Otwarcie udostępnionego linku nie
jest liczone jako ręczne wyszukiwanie. Po zmianie zakresu analityki wcześniejsza
zgoda musi zostać ponownie wyrażona.

W GA4 zdarzenie i jego parametry można sprawdzić w DebugView lub czasie
rzeczywistym. Ranking świadczeń można utworzyć w Eksploracjach przez wymiar
„Wyszukiwane hasło”, metrykę liczby zdarzeń i filtr nazwy zdarzenia `search`.
Aby analizować dodatkowe parametry w raportach i Eksploracjach, należy utworzyć
w GA4 definicje niestandardowe o zakresie „Zdarzenie” dla każdego potrzebnego
parametru, również z sufiksem `_2` lub `_3`. Poszczególne części dłuższych
wartości są osobnymi wymiarami; pełną wartość można odtworzyć przez ich
połączenie w kolejności.
