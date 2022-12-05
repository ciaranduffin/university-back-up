def string_is_int(string):
    try:
        int(string)
        return True
    except ValueError:
        return False

def string_is_number(string):
    try:
        float(string)
        return True
    except ValueError:
        return False