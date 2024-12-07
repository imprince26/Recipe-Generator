import React, { useState } from "react";
import { Search, ChefHat, Clock, Users, ArrowLeft } from "lucide-react";

const RecipeGenerator = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("query");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const API_KEY = import.meta.env.VITE_RECIPE_API_KEY;

  const searchRecipes = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      let endpoint;
      let params = `&number=12`;

      switch (searchType) {
        case "ingredients":
          endpoint = `${import.meta.env.VITE_RECIPE_URL}/recipes/findByIngredients?ingredients=${searchQuery}${params}`;
          break;
        case "cuisine":
          endpoint = `${import.meta.env.VITE_RECIPE_URL}/recipes/complexSearch?cuisine=${searchQuery}${params}`;
          break;
        default:
          endpoint = `${import.meta.env.VITE_RECIPE_URL}/recipes/complexSearch?query=${searchQuery}${params}`;
      }

      const response = await fetch(`${endpoint}&apiKey=${API_KEY}`);
      const data = await response.json();
      setRecipes(data.results || data);
      setSelectedRecipe(null);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    }
    setLoading(false);
  };

  const getRecipeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_RECIPE_URL}/recipes/${id}/information?apiKey=${API_KEY}`
      );
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (err) {
      setError("Failed to fetch recipe details.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <ChefHat className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-center">PR Recipe Finder</h1>
        </div>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 md:w-48"
          >
            <option value="query">Recipe Name</option>
            <option value="ingredients">Ingredients</option>
            <option value="cuisine">Cuisine</option>
          </select>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder={
                searchType === "ingredients"
                  ? "Enter ingredients (comma separated)"
                  : searchType === "cuisine"
                  ? "Enter cuisine type (italian, indian, etc)"
                  : "Search recipes..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={searchRecipes}
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        {/* Recipe Grid */}
        {!selectedRecipe && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => getRecipeDetails(recipe.id)}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-750 transition border border-gray-700"
              >
                <img
                  src={recipe.image || "/api/placeholder/600/400"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-yellow-400">
                    {recipe.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Recipe Details */}
        {selectedRecipe && (
          <div>
            <button
              onClick={() => setSelectedRecipe(null)}
              className="mb-4 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </button>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4">
                  {selectedRecipe.title}
                </h2>

                <div className="mb-6">
                  <img
                    src={selectedRecipe.image || "/api/placeholder/600/400"}
                    alt={selectedRecipe.title}
                    className="w-full lg:h-[30rem] h-[18rem] rounded-lg mb-4 object-cover"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span>
                        Ready in: {selectedRecipe.readyInMinutes} mins
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-yellow-400" />
                      <span>Servings: {selectedRecipe.servings}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                      Ingredients
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedRecipe.extendedIngredients?.map(
                        (ingredient, index) => (
                          <li key={index}>{ingredient.original}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                      Instructions
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      {selectedRecipe.analyzedInstructions?.[0]?.steps.map(
                        (step, index) => (
                          <li key={index}>{step.step}</li>
                        )
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && searchQuery && (
          <div className="text-center text-gray-400">
            No recipes found. Try different search terms.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;
