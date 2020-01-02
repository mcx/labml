from typing import Union, List, Tuple, Optional, Iterable, Sized

from .colors import ANSICode
from .indicators import Indicator
from .internal import LoggerInternal as _LoggerInternal

_internal: Optional[_LoggerInternal] = None


def internal() -> _LoggerInternal:
    global _internal
    if _internal is None:
        _internal = _LoggerInternal()

    return _internal


def log(message: Union[str, List[Union[str, Tuple[str, ANSICode]]]],
        color: List[ANSICode] or ANSICode or None = None,
        *,
        is_new_line=True):
    if type(message) == str:
        internal().log(message, color=color, is_new_line=is_new_line)
    elif type(message) == list:
        internal().log_color(message, is_new_line=is_new_line)


def add_indicator(indicator: Indicator):
    internal().add_indicator(indicator)


def store(*args, **kwargs):
    """
    ### Stores a value in the logger.

    This may be added to a queue, a list or stored as
    a TensorBoard histogram depending on the
    type of the indicator.
    """

    internal().store(*args, **kwargs)


def write():
    """
    ### Output the stored log values to screen and TensorBoard summaries.
    """

    internal().write()


def new_line():
    internal().new_line()


def set_global_step(global_step):
    internal().set_global_step(global_step)


def add_global_step(global_step: int = 1):
    internal().add_global_step(global_step)


def iterator(name, iterable: Union[Iterable, Sized, int],
             total_steps: Optional[int] = None, *,
             is_silent: bool = False,
             is_timed: bool = True):
    return internal().iterator(name, iterable, total_steps, is_silent=is_silent,
                               is_timed=is_timed)


def enumerator(name, iterable: Sized, *,
               is_silent: bool = False,
               is_timed: bool = True):
    return internal().enumerator(name, iterable, is_silent=is_silent, is_timed=is_timed)


def section(name, *,
            is_silent: bool = False,
            is_timed: bool = True,
            is_partial: bool = False,
            total_steps: float = 1.0):
    return internal().section(name, is_silent=is_silent,
                              is_timed=is_timed,
                              is_partial=is_partial,
                              total_steps=total_steps)


def progress(steps: float):
    internal().progress(steps)


def set_successful(is_successful=True):
    internal().set_successful(is_successful)


def loop(iterator_: range, *,
         is_print_iteration_time=True):
    return internal().loop(iterator_, is_print_iteration_time=is_print_iteration_time)


def finish_loop():
    internal().finish_loop()


def save_checkpoint():
    internal().save_checkpoint()


def info(*args, **kwargs):
    """
    ### 🎨 Pretty prints a set of values.
    """

    internal().info(*args, **kwargs)


def get_data_path():
    return internal().get_data_path()
