#include "./headers/router.hpp"
#include "./headers/vertex.hpp"
#include "./headers/maxFlowSolver.hpp"
#include "./headers/mapQuadrants.hpp"
#include "./headers/KMPSolver.hpp"
#include <initializer_list>
#include <codecvt>
#include <locale>

wstring utf8_to_wstring(const string& str) {
    wstring_convert<codecvt_utf8_utf16<wchar_t>> converter;
    return converter.from_bytes(str);
}
string wstring_to_utf8(const wstring& wstr) {
    wstring_convert<codecvt_utf8_utf16<wchar_t>> converter;
    return converter.to_bytes(wstr);
}

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

    //Edit one Vertex
    this->app_.route_dynamic(this->path+"/vertices/<int>")
            .methods(crow::HTTPMethod::Patch)
                    ([this](const crow::request& req, int id) {
                        if(id >= this->allVertices.size() || id<0)
                            return crow::response(400, "Invalid Id!");

                        auto body = crow::json::load(req.body);
                        if (!body || body.size() > 1)
                            return crow::response(400, "Invalid JSON");

                        const auto& item = body[0];
                        if (!item.has("type") || !item.has("position") || !item["position"].has("x") || !item["position"].has("y")) {
                            return crow::response(400, "Invalid item in list");
                        }

                        Vertex* v;
                        switch(((std::string)item["type"].s())[0]){
                            case 'f': {
                                v = new Field(item["position"]["x"].d(), item["position"]["y"].d(), item["production"].d());
                                Field* f = dynamic_cast<Field*>(v);
                                if(this->mapQuadrants.getQuadrantOfField(f) == -1) break;
                                f->production = mapQuadrants.quadrants[this->mapQuadrants.getQuadrantOfField(f)]->assignedProduction;
                                break; }
                            case 'b':
                                v = new Brewery(item["position"]["x"].d(), item["position"]["y"].d());
                                break;
                            case 'c':
                                v = new Cross(item["position"]["x"].d(), item["position"]["y"].d(), item["limit"].d());
                                break;
                            case 'i':
                                v = new Inn(item["position"]["x"].d(), item["position"]["y"].d());
                                break;
                            default:
                                v = new Vertex(item["position"]["x"].d(), item["position"]["y"].d());
                        }
                        v->id = id;
                        Vertex::counter --;
                        this->allVertices[id] = v;

                        return crow::response(200, "Ok");
                    });

    //Delete one Vertex
    this->app_.route_dynamic(this->path + "/vertices/<int>")
            .methods({crow::HTTPMethod::Delete})
                    ([this](int id) {
                        if (id < 0 || id >= static_cast<int>(this->allVertices.size()))
                            return crow::response(400, "Invalid Id!");

                        int i=0;
                        for (auto it = this->allEdges.begin(); it != this->allEdges.end(); ) {
                            Edge* e = *it;
                            if (e->start->id == id || e->end->id == id) {
                                delete e;
                                i++;
                                it = this->allEdges.erase(it);
                            } else {
                                ++it;
                            }
                        }
                        for(Edge* e : this->allEdges){
                            e->id -= i;
                        }

                        for (auto it = this->allVertices.begin(); it != this->allVertices.end(); ) {
                            Vertex* v = *it;
                            if (v->id == id) {
                                delete v;
                                it = this->allVertices.erase(it);
                            } else {
                                ++it;
                            }
                        }
                        for(Vertex* v : this->allVertices){
                            if(v->id > id) v->id --;
                        }
                        Vertex::counter --;

                        return crow::response(200, "Ok");
                    });

    //Delete one Edge
    this->app_.route_dynamic(this->path + "/edges/<int>")
            .methods({crow::HTTPMethod::Delete})
                    ([this](int id) {
                        if (id < 0 || id >= static_cast<int>(this->allEdges.size()))
                            return crow::response(400, "Invalid Id!");

                        for (auto it = this->allEdges.begin(); it != this->allEdges.end(); ) {
                            Edge* e = *it;
                            if (e->id == id) {
                                delete e;
                                it = this->allEdges.erase(it);
                            } else {
                                ++it;
                            }
                        }
                        for(Edge* e : this->allEdges){
                            if(e->id > id) e->id --;
                        }
                        Edge::freeId --;

                        return crow::response(200, "Ok");
                    });

    //Edit one Edge
    this->app_.route_dynamic(this->path + "/edges/<int>")
            .methods({crow::HTTPMethod::Patch})
                    ([this](const crow::request& req,int id) {
                        if(id >= this->allEdges.size() || id<0)
                            return crow::response(400, "Invalid Id!");

                        auto body = crow::json::load(req.body);
                        if (!body || body.size() > 1)
                            return crow::response(400, "Invalid JSON");

                        const auto& item = body[0];
                        if (!item.has("fromId") || !item.has("toId") || item["toId"].i() == item["fromId"].i() ) {
                            return crow::response(400, "Invalid item in list");
                        }

                        double cost = item.has("cost") ? item["cost"].d() : this->allEdges[id]->cost;
                        delete this->allEdges[id];

                        Vertex* fromV = this->allVertices[item["fromId"].i()];
                        Vertex* toV = this->allVertices[item["toId"].i()];

                        Edge* e = new Edge(fromV,toV,cost);
                        e->id = id;
                        Edge::freeId --;

                        this->allEdges[id] = e;

                        return crow::response(200, "Ok");
                    });

    //Add many Vertices
    this->app_.route_dynamic(this->path+"/vertices")
            .methods(crow::HTTPMethod::Post)
                    ([this](const crow::request& req) {
                        auto body = crow::json::load(req.body);
                        if (!body)
                            return crow::response(400, "Invalid JSON");

                        if(this->mapQuadrants.quadrants.size() != 4)
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
                                    if(this->mapQuadrants.getQuadrantOfField(f) == -1) break;
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
                            double cost = item["cost"].d();

                            this->allEdges.push_back(new Edge(v1, v2,cost));
                            i++;
                        }

                        std::ostringstream os;
                        os << i << " Edges Added!";
                        return crow::response(200,os.str());
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
                            edge["cost"] = e->cost;

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

    this->app_.route_dynamic(this->path+"/min-cost-max-flow")
            .methods(crow::HTTPMethod::Get)
                    ([this]() {
                        this->maxFlowSolver = MaxFlowSolver(this->allVertices, this->allEdges);

                        crow::json::wvalue response_json;
                        response_json = crow::json::wvalue::list();
                        int i = 0;

                        this->maxFlowSolver.isBeerCreated = false;
                        std::vector<std::tuple<int,int,float>> barley_used_edges;
                        float barley_total_flow = 0;
                        float min_cost_barley = this->maxFlowSolver.minCostMaxFlow(barley_used_edges, this->allVertices, barley_total_flow);

                        crow::json::wvalue maxBarleyFlowInfo;
                        maxBarleyFlowInfo["maxBarleyFlow"] = barley_total_flow;
                        maxBarleyFlowInfo["minCostBarleyTransport"] = min_cost_barley;
                        response_json[i++] = std::move(maxBarleyFlowInfo);

                        for (auto& [u, v, f] : barley_used_edges) {
                            crow::json::wvalue path;
                            path["fromId"] = u;
                            path["toId"] = v;
                            path["amount"] = f;
                            path["transports"] = "barley";
                            response_json[i++] = std::move(path);
                        }

                        this->maxFlowSolver.isBeerCreated = true;
                        std::vector<std::tuple<int,int,float>> beer_used_edges;
                        float beer_total_flow = 0;
                        float min_cost_beer = this->maxFlowSolver.minCostMaxFlow(beer_used_edges, this->allVertices, beer_total_flow);

                        crow::json::wvalue maxBeerFlowInfo;
                        maxBeerFlowInfo["maxBeerFlow"] = beer_total_flow;
                        maxBeerFlowInfo["minCostBeerTransport"] = min_cost_beer;
                        response_json[i++] = std::move(maxBeerFlowInfo);

                        for (auto& [u, v, f] : beer_used_edges) {
                            crow::json::wvalue path;
                            path["fromId"] = u;
                            path["toId"] = v;
                            path["amount"] = f;
                            path["transports"] = "beer";
                            response_json[i++] = std::move(path);
                        }

                        return crow::response(response_json);
                    });

    this->app_.route_dynamic(this->path+"/max-flow")
            .methods(crow::HTTPMethod::Get)
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

       this->app_.route_dynamic(this->path+"/KMP")
            .methods(crow::HTTPMethod::Post)
                    ([](const crow::request& req) {

                        auto body = crow::json::load(req.body);
                        if (!body) {
                            return crow::response(400, "Invalid JSON");
                        }
                        if (!body[0].has("text") || !body[0].has("pattern") || body.size()>1) {
                            return crow::response(400, "Allows only one item and item must have 'text' and 'pattern'");
                        }

                        string tekst_utf8 = body[0]["text"].s();
                        string pattern_utf8 = body[0]["pattern"].s();

                        wstring tekst = utf8_to_wstring(tekst_utf8);
                        wstring pattern = utf8_to_wstring(pattern_utf8);

                        KMPSolver rob(tekst, pattern);
                        vector<KMPAns> wyniki = rob.KMP();

                        crow::json::wvalue vertices_json;
                        vertices_json = crow::json::wvalue::list();

                        int i = 0;
                        for (const auto& wynik : wyniki) {
                            crow::json::wvalue pattern_json;

                            pattern_json["row"] = wynik.row;
                            pattern_json["column"] = wynik.column;
                            pattern_json["length"] = wynik.length;
                            pattern_json["lineText"] = wstring_to_utf8(wynik.lineText);

                            vertices_json[i++] = std::move(pattern_json);
                        }
                return crow::response(200, vertices_json);
            });
}
