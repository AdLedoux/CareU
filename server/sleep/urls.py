from django.urls import path

from .views import SleepImportView, SleepLogListCreateView, SleepSummaryView

urlpatterns = [
    path("logs/", SleepLogListCreateView.as_view(), name="sleep-logs"),
    path("import/", SleepImportView.as_view(), name="sleep-import"),
    path("summary/", SleepSummaryView.as_view(), name="sleep-summary"),
]
