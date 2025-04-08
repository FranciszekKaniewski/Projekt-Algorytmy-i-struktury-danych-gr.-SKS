struct Position{
    int x;
    int y;
};

class Vertex {
public:
    Vertex(Position pos);
    ~Vertex();

    static int id;
    Position position;


};