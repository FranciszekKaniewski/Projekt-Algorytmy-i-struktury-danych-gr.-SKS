/*struct Connection{
    Vertex v1;
    Vertex v2;
};*/

class Edge{
public:
    bool Destroyed = false;
    static int id;
    int maxValue;
    int currentValue;
    //Connection con;
    Vertex v1;
    Vertex v2;

    Edge(int val, Vertex v1, Vertex v2);

    void Add_Edge(int val);

    ~Edge();

};