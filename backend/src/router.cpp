#include "headers/router.hpp"

Router::Router(crow::App<crow::CORSHandler>& app, std::string path) : app_(app), path(path) {
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

    this->app_.route_dynamic(this->path+"/file")
            .methods(crow::HTTPMethod::Post)
                    ([](const crow::request& req) {
                        auto body = crow::json::load(req.body);
                        if (!body)
                            return crow::response(400, "Invalid JSON");

                        std::ostringstream os;
                        os << "Tworze " << body["type"] << " id: " << body["id"] << " na pozycji x: " << body["position"]["x"] << "y: " << body["position"]["y"] << " !\n";
                        return crow::response(os.str());
                    });
}
