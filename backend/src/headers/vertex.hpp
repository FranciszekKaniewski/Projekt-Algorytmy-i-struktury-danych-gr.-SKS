#include <vector>

using namespace std;

struct Location{
    double x;
    double y;
};

class Vertex{
private:
    int id;
    static int counter;
    Location location;
public:   
    Vertex(double x, double y);

    void print();
};