select
  avg(salary) as mean,
  percentile_cont(0.5) within group (order by salary) as median,
  mode() within group (order by salary) as mode
from employees;
