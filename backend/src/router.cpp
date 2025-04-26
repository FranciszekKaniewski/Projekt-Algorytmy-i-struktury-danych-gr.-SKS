#include "./headers/router.hpp"
#include "./headers/vertex.hpp"

Router::Router(crow::App<crow::CORSHandler>& app, std::vector<Vertex>& allVertices, std::string path)
        : app_(app), allVertices(allVertices), path(path) {
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

                        int i=0;
                        for (const auto& item : body) {
                            if (!item.has("type") || !item.has("position") || !item["position"].has("x") || !item["position"].has("y")) {
                                return crow::response(400, "Invalid item in list");
                            }

                            Vertex v(item["position"]["x"].d(), item["position"]["y"].d());
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
                        for (const auto& v : this->allVertices) {
                            crow::json::wvalue vertex;
                            vertex["id"] = v.id;
                            vertex["x"] = v.location.x;
                            vertex["y"] = v.location.y;
                            vertices_json[i++] = std::move(vertex);
                        }

                        return crow::response(vertices_json);
                    });

    
}
