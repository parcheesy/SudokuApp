load_routes do |route|

  route.get "/", "SudokuController", "create_puzzle"
  route.get "/create", "SudokuController", "create_puzzle"
  route.get "/json/new", "SudokuController", "new_puzzle"
  route.get "/json/add", "SudokuController", "add_entry"
  route.get "/json/remove", "SudokuController", "remove_entry"
  route.get "/json/complete", "SudokuController", "complete?"
  route.get "/json/check", "SudokuController", "check"


end
