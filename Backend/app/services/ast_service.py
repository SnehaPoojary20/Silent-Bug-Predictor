import ast


def extract_ast_features(content: str) -> dict:
    try:
        tree = ast.parse(content)
    except SyntaxError:
        return {
            "loc": 0,
            "function_count": 0,
            "cyclomatic_complexity": 0,
        }

    loc = len(content.splitlines())
    function_count = 0
    cyclomatic_complexity = 1

    class ComplexityVisitor(ast.NodeVisitor):
        def visit_FunctionDef(self, node):
            nonlocal function_count
            function_count += 1
            self.generic_visit(node)

        def visit_AsyncFunctionDef(self, node):
            nonlocal function_count
            function_count += 1
            self.generic_visit(node)

        def visit_If(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

        def visit_For(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

        def visit_While(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

        def visit_Try(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

        def visit_BoolOp(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

        def visit_IfExp(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

        def visit_ExceptHandler(self, node):
            nonlocal cyclomatic_complexity
            cyclomatic_complexity += 1
            self.generic_visit(node)

    ComplexityVisitor().visit(tree)

    return {
        "loc": loc,
        "function_count": function_count,
        "cyclomatic_complexity": cyclomatic_complexity,
    }