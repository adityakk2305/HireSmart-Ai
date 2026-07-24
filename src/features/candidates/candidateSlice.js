import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addRecruiterNoteRequest,
  bulkCandidateActionRequest,
  bulkScreenCandidatesRequest,
  compareCandidatesRequest,
  deleteCandidateRequest,
  deleteCandidateWithReasonRequest,
  deleteRecruiterNoteRequest,
  downloadCandidatesCsv,
  getCandidateAiEvaluationRequest,
  getCandidateByIdRequest,
  getCandidateResumeDataRequest,
  getCandidatesByJobRequest,
  getCandidatesRequest,
  parseCandidateResumeRequest,
  screenCandidateRequest,
  updateRecruiterNoteRequest,
  updateCandidateRequest,
  updateCandidateStatusRequest,
  uploadCandidateByHRRequest
} from "../../api/candidateApi.js";
import { DEFAULT_CANDIDATE_FILTERS } from "../../utils/constants.js";

const initialState = {
  candidates: [],
  selectedCandidate: null,
  comparisonCandidates: null,
  summary: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0, hasNextPage: false, hasPreviousPage: false },
  filters: DEFAULT_CANDIDATE_FILTERS,
  selectedCandidateIds: [],
  loading: false,
  detailsLoading: false,
  saving: false,
  uploading: false,
  deleting: false,
  exporting: false,
  comparing: false,
  bulkActionLoading: false,
  notesLoading: false,
  parsingResume: false,
  screeningCandidate: false,
  screeningCandidateId: null,
  bulkScreening: false,
  bulkScreeningResult: null,
  aiEvaluationLoading: false,
  aiScreeningError: null,
  resumeDataLoading: false,
  resumeParseError: null,
  error: null
};

const getErrorMessage = (error) => error.response?.data?.message || error.message || "Candidate request failed";

export const fetchCandidates = createAsyncThunk("candidates/fetchCandidates", async (filters, { rejectWithValue }) => {
  try {
    return await getCandidatesRequest(filters);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCandidatesByJob = createAsyncThunk("candidates/fetchCandidatesByJob", async ({ jobId, filters }, { rejectWithValue }) => {
  try {
    return await getCandidatesByJobRequest(jobId, filters);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCandidateById = createAsyncThunk("candidates/fetchCandidateById", async (id, { rejectWithValue }) => {
  try {
    return await getCandidateByIdRequest(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const uploadCandidate = createAsyncThunk("candidates/uploadCandidate", async ({ jobId, formData }, { rejectWithValue }) => {
  try {
    return await uploadCandidateByHRRequest(jobId, formData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateCandidate = createAsyncThunk("candidates/updateCandidate", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateCandidateRequest(id, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateCandidateStatus = createAsyncThunk("candidates/updateCandidateStatus", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateCandidateStatusRequest(id, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteCandidate = createAsyncThunk("candidates/deleteCandidate", async (id, { rejectWithValue }) => {
  try {
    return await deleteCandidateRequest(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const softDeleteCandidate = createAsyncThunk("candidates/softDeleteCandidate", async ({ id, deletionReason = "" }, { rejectWithValue }) => {
  try {
    return { id, data: await deleteCandidateWithReasonRequest(id, deletionReason) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const parseResume = createAsyncThunk("candidates/parseResume", async ({ id, force = false }, { rejectWithValue }) => {
  try {
    return await parseCandidateResumeRequest(id, force);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchResumeData = createAsyncThunk("candidates/fetchResumeData", async (id, { rejectWithValue }) => {
  try {
    return await getCandidateResumeDataRequest(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const runCandidateScreening = createAsyncThunk("candidates/runCandidateScreening", async ({ id, force = false }, { rejectWithValue }) => {
  try {
    return await screenCandidateRequest(id, force);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCandidateAiEvaluation = createAsyncThunk("candidates/fetchCandidateAiEvaluation", async (id, { rejectWithValue }) => {
  try {
    return await getCandidateAiEvaluationRequest(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const runBulkCandidateScreening = createAsyncThunk("candidates/runBulkCandidateScreening", async ({ candidateIds, force = false }, { rejectWithValue }) => {
  try {
    return await bulkScreenCandidatesRequest(candidateIds, force);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addRecruiterNote = createAsyncThunk("candidates/addRecruiterNote", async ({ id, text }, { rejectWithValue }) => {
  try {
    return await addRecruiterNoteRequest(id, { text });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateRecruiterNote = createAsyncThunk("candidates/updateRecruiterNote", async ({ id, noteId, text }, { rejectWithValue }) => {
  try {
    return await updateRecruiterNoteRequest(id, noteId, { text });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteRecruiterNote = createAsyncThunk("candidates/deleteRecruiterNote", async ({ id, noteId }, { rejectWithValue }) => {
  try {
    return await deleteRecruiterNoteRequest(id, noteId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const performBulkCandidateAction = createAsyncThunk("candidates/performBulkCandidateAction", async (payload, { rejectWithValue }) => {
  try {
    return await bulkCandidateActionRequest(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCandidateComparison = createAsyncThunk("candidates/fetchCandidateComparison", async (candidateIds, { rejectWithValue }) => {
  try {
    return await compareCandidatesRequest(candidateIds);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const exportCandidates = createAsyncThunk("candidates/exportCandidates", async ({ params, filename }, { rejectWithValue }) => {
  try {
    await downloadCandidatesCsv(params, filename);
    return true;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    setCandidateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetCandidateFilters: (state) => {
      state.filters = DEFAULT_CANDIDATE_FILTERS;
    },
    setSelectedCandidateIds: (state, action) => {
      state.selectedCandidateIds = action.payload;
    },
    clearSelectedCandidateIds: (state) => {
      state.selectedCandidateIds = [];
    },
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
      state.aiScreeningError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateById.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      .addCase(uploadCandidate.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadCandidate.fulfilled, (state, action) => {
        state.uploading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(uploadCandidate.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(parseResume.pending, (state) => {
        state.parsingResume = true;
        state.resumeParseError = null;
      })
      .addCase(parseResume.fulfilled, (state, action) => {
        state.parsingResume = false;
        if (state.selectedCandidate?.candidate) {
          state.selectedCandidate.candidate.resumeParseStatus = action.payload.parseStatus;
          state.selectedCandidate.candidate.resumeParsedAt = action.payload.parsedAt;
          state.selectedCandidate.candidate.resumeParserProvider = action.payload.parserProvider;
          state.selectedCandidate.candidate.resumeTextLength = action.payload.textLength;
          state.selectedCandidate.candidate.parsedResume = action.payload.parsedResume;
        }
      })
      .addCase(parseResume.rejected, (state, action) => {
        state.parsingResume = false;
        state.resumeParseError = action.payload;
      })
      .addCase(fetchResumeData.pending, (state) => {
        state.resumeDataLoading = true;
      })
      .addCase(fetchResumeData.fulfilled, (state, action) => {
        state.resumeDataLoading = false;
        if (state.selectedCandidate?.candidate) {
          state.selectedCandidate.candidate.resumeParseStatus = action.payload.parseStatus;
          state.selectedCandidate.candidate.resumeParseError = action.payload.parseError;
          state.selectedCandidate.candidate.resumeParsedAt = action.payload.parsedAt;
          state.selectedCandidate.candidate.resumeParserVersion = action.payload.parserVersion;
          state.selectedCandidate.candidate.resumeParserProvider = action.payload.provider;
          state.selectedCandidate.candidate.resumeParserModel = action.payload.model;
          state.selectedCandidate.candidate.resumeTextLength = action.payload.textLength;
          state.selectedCandidate.candidate.resumeParseAttempts = action.payload.attempts;
          state.selectedCandidate.candidate.resumeTextTruncated = action.payload.truncationOccurred;
          state.selectedCandidate.candidate.resumeParserFallbackUsed = action.payload.fallbackUsed;
          state.selectedCandidate.candidate.parsedResume = action.payload.parsedResume;
        }
      })
      .addCase(fetchResumeData.rejected, (state, action) => {
        state.resumeDataLoading = false;
        state.resumeParseError = action.payload;
      })
      .addCase(runCandidateScreening.pending, (state, action) => {
        state.screeningCandidate = true;
        state.screeningCandidateId = action.meta.arg.id;
        state.aiScreeningError = null;
      })
      .addCase(runCandidateScreening.fulfilled, (state, action) => {
        state.screeningCandidate = false;
        state.screeningCandidateId = null;
        const payload = action.payload;
        if (state.selectedCandidate?.candidate?.id === payload.candidateId) {
          state.selectedCandidate.candidate.aiEvaluation = payload.evaluation;
          state.selectedCandidate.candidate.aiScreeningStatus = payload.screeningStatus;
          state.selectedCandidate.candidate.aiScreeningError = payload.screeningError;
          state.selectedCandidate.candidate.aiScreenedAt = payload.screenedAt;
          state.selectedCandidate.candidate.aiProvider = payload.provider;
          state.selectedCandidate.candidate.aiModel = payload.model;
          state.selectedCandidate.candidate.aiScreeningVersion = payload.version;
          state.selectedCandidate.candidate.aiScreeningAttempts = payload.attempts;
          state.selectedCandidate.candidate.aiProviderFallbackUsed = payload.fallbackUsed;
        }
        state.candidates = state.candidates.map((candidate) =>
          candidate.id === payload.candidateId
            ? {
                ...candidate,
                aiScreeningStatus: payload.screeningStatus,
                aiScreenedAt: payload.screenedAt,
                overallScore: payload.evaluation?.overallScore ?? null,
                category: payload.evaluation?.category ?? null,
                requiredSkillsFound: payload.evaluation?.requiredSkillsFound || [],
                requiredSkillsMissing: payload.evaluation?.requiredSkillsMissing || [],
                isAiEvaluationOutdated: payload.isOutdated
              }
            : candidate
        );
      })
      .addCase(runCandidateScreening.rejected, (state, action) => {
        state.screeningCandidate = false;
        state.screeningCandidateId = null;
        state.aiScreeningError = action.payload;
      })
      .addCase(fetchCandidateAiEvaluation.pending, (state) => {
        state.aiEvaluationLoading = true;
        state.aiScreeningError = null;
      })
      .addCase(fetchCandidateAiEvaluation.fulfilled, (state, action) => {
        state.aiEvaluationLoading = false;
        const payload = action.payload;
        if (state.selectedCandidate?.candidate?.id === payload.candidateId) {
          state.selectedCandidate.candidate.aiEvaluation = payload.evaluation;
          state.selectedCandidate.candidate.aiScreeningStatus = payload.screeningStatus;
          state.selectedCandidate.candidate.aiScreeningError = payload.screeningError;
          state.selectedCandidate.candidate.aiScreenedAt = payload.screenedAt;
          state.selectedCandidate.candidate.aiProvider = payload.provider;
          state.selectedCandidate.candidate.aiModel = payload.model;
          state.selectedCandidate.candidate.aiScreeningVersion = payload.version;
          state.selectedCandidate.candidate.aiScreeningAttempts = payload.attempts;
          state.selectedCandidate.candidate.aiProviderFallbackUsed = payload.fallbackUsed;
          state.selectedCandidate.candidate.isAiEvaluationOutdated = payload.isOutdated;
        }
      })
      .addCase(fetchCandidateAiEvaluation.rejected, (state, action) => {
        state.aiEvaluationLoading = false;
        state.aiScreeningError = action.payload;
      })
      .addCase(runBulkCandidateScreening.pending, (state) => {
        state.bulkScreening = true;
        state.bulkScreeningResult = null;
        state.aiScreeningError = null;
      })
      .addCase(runBulkCandidateScreening.fulfilled, (state, action) => {
        state.bulkScreening = false;
        state.bulkScreeningResult = action.payload;
        const byId = new Map(action.payload.results.map((item) => [item.candidateId, item]));
        state.candidates = state.candidates.map((candidate) => {
          const result = byId.get(candidate.id);
          if (!result?.success) return candidate;
          return {
            ...candidate,
            aiScreeningStatus: result.screeningStatus || "Screened",
            overallScore: result.score,
            category: result.category
          };
        });
      })
      .addCase(runBulkCandidateScreening.rejected, (state, action) => {
        state.bulkScreening = false;
        state.aiScreeningError = action.payload;
      })
      .addCase(deleteRecruiterNote.fulfilled, (state, action) => {
        state.notesLoading = false;
        if (state.selectedCandidate?.candidate) {
          state.selectedCandidate.candidate.recruiterNotes = (state.selectedCandidate.candidate.recruiterNotes || []).filter(
            (note) => (note.id || note._id) !== action.payload.noteId
          );
        }
      })
      .addCase(performBulkCandidateAction.pending, (state) => {
        state.bulkActionLoading = true;
        state.error = null;
      })
      .addCase(performBulkCandidateAction.fulfilled, (state) => {
        state.bulkActionLoading = false;
        state.selectedCandidateIds = [];
      })
      .addCase(performBulkCandidateAction.rejected, (state, action) => {
        state.bulkActionLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCandidateComparison.pending, (state) => {
        state.comparing = true;
        state.error = null;
      })
      .addCase(fetchCandidateComparison.fulfilled, (state, action) => {
        state.comparing = false;
        state.comparisonCandidates = action.payload;
      })
      .addCase(fetchCandidateComparison.rejected, (state, action) => {
        state.comparing = false;
        state.error = action.payload;
      })
      .addCase(exportCandidates.pending, (state) => {
        state.exporting = true;
      })
      .addCase(exportCandidates.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportCandidates.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) => [fetchCandidates.pending.type, fetchCandidatesByJob.pending.type].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [fetchCandidates.fulfilled.type, fetchCandidatesByJob.fulfilled.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.candidates = action.payload.candidates;
          state.pagination = action.payload.pagination;
          state.summary = action.payload.summary || null;
        }
      )
      .addMatcher(
        (action) => [fetchCandidates.rejected.type, fetchCandidatesByJob.rejected.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => [updateCandidate.pending.type, updateCandidateStatus.pending.type].includes(action.type),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [updateCandidate.fulfilled.type, updateCandidateStatus.fulfilled.type].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.selectedCandidate = action.payload;
        }
      )
      .addMatcher(
        (action) => [updateCandidate.rejected.type, updateCandidateStatus.rejected.type].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => [deleteCandidate.pending.type, softDeleteCandidate.pending.type].includes(action.type),
        (state) => {
          state.deleting = true;
        }
      )
      .addMatcher(
        (action) => [deleteCandidate.fulfilled.type, softDeleteCandidate.fulfilled.type].includes(action.type),
        (state, action) => {
          state.deleting = false;
          const deletedId = action.payload?.id;
          if (deletedId) {
            state.candidates = state.candidates.filter((candidate) => candidate.id !== deletedId);
            state.selectedCandidateIds = state.selectedCandidateIds.filter((id) => id !== deletedId);
          }
        }
      )
      .addMatcher(
        (action) => [deleteCandidate.rejected.type, softDeleteCandidate.rejected.type].includes(action.type),
        (state, action) => {
          state.deleting = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => [addRecruiterNote.pending.type, updateRecruiterNote.pending.type, deleteRecruiterNote.pending.type].includes(action.type),
        (state) => {
          state.notesLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [addRecruiterNote.fulfilled.type, updateRecruiterNote.fulfilled.type].includes(action.type),
        (state, action) => {
          state.notesLoading = false;
          if (state.selectedCandidate?.candidate) {
            const notes = state.selectedCandidate.candidate.recruiterNotes || [];
            const note = action.payload.note;
            state.selectedCandidate.candidate.recruiterNotes = notes.some((item) => (item.id || item._id) === note.id)
              ? notes.map((item) => ((item.id || item._id) === note.id ? note : item))
              : [note, ...notes];
          }
        }
      )
      .addMatcher(
        (action) => [addRecruiterNote.rejected.type, updateRecruiterNote.rejected.type, deleteRecruiterNote.rejected.type].includes(action.type),
        (state, action) => {
          state.notesLoading = false;
          state.error = action.payload;
        }
      );
  }
});

export const {
  clearSelectedCandidate,
  clearSelectedCandidateIds,
  resetCandidateFilters,
  setCandidateFilters,
  setSelectedCandidateIds
} = candidateSlice.actions;
export default candidateSlice.reducer;
