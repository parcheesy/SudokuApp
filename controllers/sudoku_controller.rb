#### Controller for creating proper responses for interacting
#### with Sudoku puzzle
lib = File.expand_path('..', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

require 'erb'
require 'sudoku'
require 'json'

class SudokuController
  
  attr_reader :puzzle, :solution

  # Create puzzle and return html with puzzle.
  # Params argument can include difficulty level
  # between easy and very hard
  def create_puzzle(params)
    difficulty = params[:difficulty] || "medium"
    case difficulty
    when "medium"
      blanks = rand(49..51)
    when "hard"
      blanks = rand(52..54)
    when "very hard"
      blanks = rand(55..57)
    when "easy"
      blanks = rand(45..48)
    when "very easy"
      blanks = rand(40..44)
    end
    c = Sudoku.make(blanks)
    @puzzle = c[0]
    @solution = c[1]
     
    # Returns html using index.html.erb template
    # Bindings include @puzzle and @solution
    current_dir = File.dirname(__FILE__)
    text = File.read(File.join(current_dir, "../erb/index.html.erb"))
    return ERB.new(text).result(binding)

  end

  # Create new puzzle and return as json
  # so that existing user can start new
  # Sudoku puzzle. Difficulty can again be passed
  # in params.
  def new_puzzle(params)
    difficulty = params[:difficulty] || "medium"
    case difficulty
    when "medium"
      blanks = rand(49..51)
    when "hard"
      blanks = rand(52..54)
    when "very hard"
      blanks = rand(55..57)
    when "easy"
      blanks = rand(45..48)
    when "very easy"
      blanks = rand(40..44)
    end
    c = Sudoku.make(blanks)
    @puzzle = c[0]
    @solution = c[1]
    
    # Returns json object with array representing puzzle 
    return JSON.generate({puzzle: @puzzle.puzzle}) 
  end

  # Add entry to puzzle
  # Params must include a row number and column number
  # representing the location in the puzzle
  # and a entry to fill that location.
  # JSON object returned with indication whether
  # entry is valid (1-9) and wheter it is correct
  def add_entry(params)
    index = params[:index].to_i
    entry = params[:entry].to_s
    if @puzzle.choices.include? entry
      @puzzle[index] = entry
      if entry == @solution[index]
        return JSON.generate({valid: true, correct: true})
      else
        return JSON.generate({valid: true, correct: false})
      end
    else
      return JSON.generate({valid: false, correct: false})
    end
  end

  # Remove entry in puzzle at given row and column in 
  # params argument. Return JSON object indicating
  # entry was properly removed
  def remove_entry(params)
    index = params[:index].to_i
    @puzzle[index] =  "."
    return JSON.generate({removed: true})
  end

  # Check if puzzle is complete and accurate.
  # Return JSON object with true/false value 
  # for each criteria: complete and accurate.
  # Complete means each spot of the puzzle has 
  # valid value. Accurate means the puzzle has
  # been solved.
  def complete?(params)
    if @puzzle.complete?
      if @puzzle.to_s == @solution.to_s
        return JSON.generate({complete: true, accurate: true})
      else
        return JSON.generate({complete: true, accurate: false})
      end
    else
      return JSON.generate({complete: false, accurate: false})
    end
  end

  # Check if the puzzle is accurate thus far. Will
  # return a JSON array with a true at every correct
  # index and false at every incorrect index. Empty
  # spots are incorrect.
  def check(params)
    return JSON.generate({check: Sudoku.check(@puzzle, @solution)})
  end

  

end
