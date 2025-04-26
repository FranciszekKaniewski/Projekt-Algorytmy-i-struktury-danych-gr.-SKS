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
    
public:   
    Vertex(double x, double y);
    Location location;

    void print();
};