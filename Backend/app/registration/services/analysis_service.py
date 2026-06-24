import ast


def extract_ast_features(code: str) -> dict:
    try:
        tree = ast.parse(code)

    except SyntaxError:
        # File has broken Python syntax
        return {
            "loc": 0,
            "function_count": 0,
            "cyclomatic_complexity": 0,
        }

    # Count of non-blank, non-comment lines
    loc = sum(
        1
        for line in code.splitlines()
        if line.strip() and not line.strip().startswith("#")
    )

    # ast.walk visits EVERY node in the syntax tree recursively
    function_count = sum(
        1
        for node in ast.walk(tree)
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
    )

    # Every branching point makes code harder to test = higher bug risk
    complexity_nodes = (
        ast.If,
        ast.For,
        ast.While,
        ast.ExceptHandler,
        ast.With,
        ast.AsyncFor,
        ast.AsyncWith,
        ast.BoolOp,
    )

    cyclomatic_complexity = sum(
        1
        for node in ast.walk(tree)
        if isinstance(node, complexity_nodes)
    )

    return {
        "loc": loc,
        "function_count": function_count,
        "cyclomatic_complexity": cyclomatic_complexity,
    }