#include "./headers/router.hpp"
#include "./headers/vertex.hpp"
#include "./headers/maxFlowSolver.hpp"
#include "./headers/mapQuadrants.hpp"
#include <initializer_list>

Router::Router(crow::App<crow::CORSHandler>& app, std::vector<Vertex*> allVertices, std::vector<Edge*> allEdges, std::string path)
        : app_(app), allVertices(allVertices), allEdges(allEdges), path(path) {
    setupRoutes();
}

void Router::setupRoutes() {

    this->app_.route_dynamic(this->path)
            ([]() {
                return "Message from API :)";
            });

    this->app_.route_dynamic(this->path+"/<string>/<int>")
            .methods("POST"_method)
                    ([](std::string name, int age) {
                        return age > 17 ? "Cześć " + name : "Hej " + name + " jesteś za młody!";
                    });

    this->app_.route_dynamic(this->path+"/add-json")
            .methods(crow::HTTPMethod::Post)
                    ([](const crow::request& req) {
                        auto body = crow::json::load(req.body);
                        if (!body)
                            return crow::response(400, "Invalid JSON");

                        auto sum = body["a"].i() + body["b"].i();
                        std::ostringstream os;
                        os << sum;
                        return crow::response{os.str()};
                    });

    //Add many Vertices
    this->app_.route_dynamic(this->path+"/vertices")
            .methods(crow::HTTPMethod::Post)
                    ([this](const crow::request& req) {
                        auto body = crow::json::load(req.body);
                        if (!body)
                            return crow::response(400, "Invalid JSON");

                        if(!this->mapQuadrants.quadrants.size())
                            return crow::response(400, "Quadrants aren't added!");

                        int i=0;
                        for (const auto& item : body) {
                            if (!item.has("type") || !item.has("position") || !item["position"].has("x") || !item["position"].has("y")) {
                                return crow::response(400, "Invalid item in list");
                            }

                            Vertex* v;
                            switch(((std::string)item["type"].s())[0]){
                                case 'F': {
                                    v = new Field(item["position"]["x"].d(), item["position"]["y"].d(), item["production"].d());
                                    Field* f = dynamic_cast<Field*>(v);
                                    f->production = mapQuadrants.quadrants[this->mapQuadrants.getQuadrantOfField(f)]->assignedProduction;
                                    break; }
                                case 'B':
                                    v = new Brewery(item["position"]["x"].d(), item["position"]["y"].d());
                                    break;
                                case 'C':
                                    v = new Cross(item["position"]["x"].d(), item["position"]["y"].d(), item["limit"].d());
                                    break;
                                case 'I':
                                    v = new Inn(item["position"]["x"].d(), item["position"]["y"].d());
                                    break;
                                default:
                                    v = new Vertex(item["position"]["x"].d(), item["position"]["y"].d());
                            }
                            this->allVertices.push_back(v);
                            i++;
                        }

                        std::ostringstream os;
                        os << i << " Vertex Added!";
                        return crow::response(os.str());
                    });

    //Get many Vertices
    this->app_.route_dynamic(this->path+"/vertices")
            .methods(crow::HTTPMethod::Get)
                    ([this]() {
                        crow::json::wvalue vertices_json;
                        vertices_json = crow::json::wvalue::list();

                        int i = 0;
                        for (auto& v : this->allVertices) {

                            crow::json::wvalue vertex;
                            vertex["id"] = v->id;
                            vertex["type"] = "vertex";
                            vertex["position"]["x"] = v->location.x;
                            vertex["position"]["y"] = v->location.y;
                            vertex["production"] = 0;

                            if(auto field = dynamic_cast<Field*>(v)){
                                vertex["type"] = "field";
                                vertex["production"] = field->production;
                            }
                            else if(auto brewery = dynamic_cast<Brewery*>(v)){
                                vertex["type"] = "brewery";
                                vertex["ratio"] = brewery->ratio;
                            }
                            else if(auto cross = dynamic_cast<Cross*>(v)){
                                vertex["type"] = "cross";
                                vertex["limit"] = cross->limit;
                            }
                            else if(auto field = dynamic_cast<Inn*>(v)){
                                vertex["type"] = "inn";
                            }

                            vertices_json[i++] = std::move(vertex);
                        }

                        return crow::response(vertices_json);
                    });

    //Add many Edges
    this->app_.route_dynamic(this->path+"/edges")
            .methods(crow::HTTPMethod::Post)
                    ([this](const crow::request& req) {
                        auto body = crow::json::load(req.body);
                        if (!body)
                            return crow::response(400, "Invalid JSON");

                        int i=0;
                        for (const auto& item : body) {
                            if (!item.has("fromId") || !item.has("toId")) {
                                return crow::response(400, "Invalid item in list");
                            }

                            Vertex* v1 = Vertex::findOnePtrById(allVertices,item["fromId"].i());
                            Vertex* v2 = Vertex::findOnePtrById(allVertices,item["toId"].i());
                            if (!v1 || !v2) {
                                return crow::response(400, "Invalid vertex id");
                            }

                            this->allEdges.push_back(new Edge(v1, v2));
                            i++;
                        }

                        std::ostringstream os;
                        os << i << " Edges Added!";
                        return crow::response(os.str());
                    });

    //Get many Edges
    this->app_.route_dynamic(this->path+"/edges")
            .methods(crow::HTTPMethod::Get)
                    ([this]() {
                        crow::json::wvalue vertices_json;
                        vertices_json = crow::json::wvalue::list();

                        int i = 0;
                        for (auto& e : this->allEdges) {

                            crow::json::wvalue edge;
                            edge["id"] = e->id;
                            edge["fromId"] = e->start->id;
                            edge["toId"] = e->end->id;

                            vertices_json[i++] = std::move(edge);
                        }

                        return crow::response(vertices_json);
                    });

    //Clear all V and E
    this->app_.route_dynamic(this->path+"/clear")
            .methods(crow::HTTPMethod::Post)
                    ([this]() {
                        int i=0;
                        i += allEdges.size() + allVertices.size();
                        for (Edge* ptr : allEdges) {
                            delete ptr;
                        }
                        allEdges.clear();

                        for (Vertex* ptr : allVertices) {
                            delete ptr;
                        }
                        allVertices.clear();

                        Edge::freeId = 0;
                        Vertex::counter = 0;

                        for(auto& e : mapQuadrants.quadrants){
                            delete e;
                        }
                        mapQuadrants.quadrants.clear();

                        std::ostringstream os;
                        os << i << " Edges and Vertices Deleted!";
                        return crow::response(os.str());
                    });

    this->app_.route_dynamic(this->path+"/max-flow")
            .methods(crow::HTTPMethod::Post)
                    ([this]() {
                        this->maxFlowSolver = MaxFlowSolver(this->allVertices, this->allEdges);

                        vector<tuple<int,int,float>> used_edges;
                        float result = this->maxFlowSolver.maxFlow(used_edges,this->allVertices);

                        crow::json::wvalue vertices_json;
                        vertices_json = crow::json::wvalue::list();
                        int i =0;

                        crow::json::wvalue maxBarleyFlow;
                        maxBarleyFlow["maxBarleyFlow"] = result;
                        vertices_json[i++] = std::move(maxBarleyFlow);

                        for (auto& [u, v, f] : used_edges) {
                            crow::json::wvalue path;
                            path["fromId"] = u;
                            path["toId"] = v;
                            path["amount"] = f;
                            path["transports"] = "barley";

                            vertices_json[i++] = std::move(path);
                        }

                        this->maxFlowSolver.isBeerCreated = true;

                        used_edges.clear();
                        result = this->maxFlowSolver.maxFlow(used_edges,this->allVertices);

                        crow::json::wvalue maxBeerFlow;
                        maxBeerFlow["maxBeerFlow"] = result;
                        vertices_json[i++] = std::move(maxBeerFlow);

                        for (auto& [u, v, f] : used_edges) {
                            crow::json::wvalue path;
                            path["fromId"] = u;
                            path["toId"] = v;
                            path["amount"] = f;
                            path["transports"] = "beer";

                            vertices_json[i++] = std::move(path);
                        }

                        return crow::response(vertices_json);
                    });

    this->app_.route_dynamic(this->path + "/quadrants")
            .methods(crow::HTTPMethod::Post)
                    ([this](const crow::request& req) {
                        auto body = crow::json::load(req.body);
                        if (!body) {
                            return crow::response(400, "Invalid JSON");
                        }

                        vector<pair<vector<Point>, float>> quadrants;

                        for (const auto& item : body) {
                            if (!item.has("points") || !item.has("production")) {
                                return crow::response(400, "Each item must have 'points' and 'production'");
                            }

                            const auto& jsonPoints = item["points"];
                            if (jsonPoints.size()<3) {
                                return crow::response(400, "'points' need at least 3 points!");
                            }

                            vector<Point> points;
                            for (const auto& p : jsonPoints) {
                                if (p.size() != 2) {
                                    return crow::response(400, "Each point must be an array of two numbers");
                                }

                                float x = static_cast<float>(p["x"].d());
                                float y = static_cast<float>(p["y"].d());
                                points.push_back(Point{x, y});
                            }

                            float production = static_cast<float>(item["production"].d());

                            quadrants.emplace_back(points, production);
                        }

                        this->mapQuadrants = MapQuadrants(this->allVertices, quadrants);

                        return crow::response(200, "Quadrants added!");
                    });

    this->app_.route_dynamic(this->path+"/quadrants")
            .methods(crow::HTTPMethod::Get)
                    ([this]() {
                        crow::json::wvalue vertices_json;
                        vertices_json = crow::json::wvalue::list();

                        int i = 0;
                        for (auto& q : this->mapQuadrants.quadrants) {

                            crow::json::wvalue quadrant;
                            quadrant["production"] = q->assignedProduction;

                            int j =0;
                            for(auto& p : q->points){
                                quadrant["points"][j]["x"] = p.x;
                                quadrant["points"][j]["y"] = p.y;
                                j++;
                            }

                            vertices_json[i++] = std::move(quadrant);
                        }

                        return crow::response(vertices_json);
                    });
}
