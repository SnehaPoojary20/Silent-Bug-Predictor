from app.services.ast_service import extract_ast_features


def test_empty_file_returns_zero_counts():
    features = extract_ast_features("")
    assert features["loc"] == 0
    assert features["function_count"] == 0
    assert features["cyclomatic_complexity"] == 1


def test_syntax_error_returns_zeroed_features():
    # Malformed source should never crash the analysis pipeline.
    features = extract_ast_features("def broken(:\n    pass")
    assert features == {
        "loc": 0,
        "function_count": 0,
        "cyclomatic_complexity": 0,
    }


def test_counts_top_level_and_nested_functions():
    code = """
def outer():
    def inner():
        pass
    return inner

async def fetch():
    pass
"""
    features = extract_ast_features(code)
    assert features["function_count"] == 3  # outer, inner, fetch


def test_loc_counts_all_lines_including_blank_and_comments():
    code = "x = 1\n\n# comment\ny = 2\n"
    features = extract_ast_features(code)
    assert features["loc"] == 4


def test_baseline_complexity_is_one_for_straight_line_code():
    code = "x = 1\ny = 2\nz = x + y\n"
    features = extract_ast_features(code)
    assert features["cyclomatic_complexity"] == 1


def test_if_elif_and_for_each_increment_complexity():
    code = """
def f(items):
    for item in items:
        if item > 0:
            pass
        elif item < 0:
            pass
    return items
"""
    features = extract_ast_features(code)
    assert features["cyclomatic_complexity"] == 4


def test_try_except_increments_complexity_per_handler():
    code = """
def f():
    try:
        risky()
    except ValueError:
        pass
    except TypeError:
        pass
"""
    features = extract_ast_features(code)
    assert features["cyclomatic_complexity"] == 4


def test_boolean_operators_increment_complexity():
    code = "def f(a, b):\n    return a and b or a\n"
    features = extract_ast_features(code)
    assert features["cyclomatic_complexity"] >= 2