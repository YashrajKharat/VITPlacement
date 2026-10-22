"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// 1. List All Interactive Quizzes
export async function getQuizzesAction(category = "ALL") {
  try {
    const session = await auth();
    const quizzes = await db.quizzes.list(category);

    let attemptedQuizIds = new Set();
    if (session?.user?.id) {
      const attempts = await db.quizAttempts.listByStudent(session.user.id);
      attempts.forEach(a => attemptedQuizIds.add(a.quizId));
    }

    const enriched = quizzes.map(q => ({
      ...q,
      isCompleted: attemptedQuizIds.has(q.id)
    }));

    return { success: true, quizzes: enriched };
  } catch (err) {
    return { error: "Failed to load quizzes." };
  }
}

// 2. Get Single Quiz with Questions
export async function getQuizByIdAction(id) {
  try {
    const quiz = await db.quizzes.getById(id);
    if (!quiz) return { error: "Quiz not found" };

    return { success: true, quiz };
  } catch (err) {
    return { error: err.message || "Failed to load quiz." };
  }
}

// 3. Submit Quiz Attempt and Generate Certificate of Merit
export async function submitQuizAttemptAction(quizId, answers, timeSpentSeconds = 0) {
  try {
    const session = await auth();
    const studentId = session?.user?.id || "student-1788620582804";
    const studentName = session?.user?.name || "Yashraj Nana kharat";

    const quiz = await db.quizzes.getById(quizId);
    if (!quiz) return { error: "Quiz not found" };

    let correctCount = 0;
    const questions = quiz.questions || [];
    const questionReview = questions.map((q, idx) => {
      const selected = answers[q.id] !== undefined ? answers[q.id] : answers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length || 1;
    const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);
    const earnedPoints = Math.round((correctCount / totalQuestions) * (quiz.points || 200));
    const unstopCoinsEarned = accuracyPercent >= 60 ? (quiz.unstopCoinsReward || 50) : 10;

    const attempt = await db.quizAttempts.create({
      quizId,
      quizTitle: quiz.title,
      category: quiz.category,
      studentId,
      studentName,
      correctCount,
      totalQuestions,
      accuracyPercent,
      earnedPoints,
      unstopCoinsEarned,
      timeSpentSeconds,
      questionReview
    });

    return {
      success: true,
      attempt,
      accuracyPercent,
      earnedPoints,
      unstopCoinsEarned,
      correctCount,
      totalQuestions,
      certificateId: attempt.certificateId
    };
  } catch (err) {
    return { error: err.message || "Failed to submit quiz attempt." };
  }
}

// 4. Get Student's Past Attempts & Certificates
export async function getStudentQuizCertificatesAction() {
  try {
    const session = await auth();
    const studentId = session?.user?.id || "student-1788620582804";
    const attempts = await db.quizAttempts.listByStudent(studentId);

    return { success: true, attempts };
  } catch (err) {
    return { error: "Failed to load quiz certificates." };
  }
}
